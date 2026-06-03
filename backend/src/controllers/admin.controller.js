const ErrorResponse = require('../utils/errorResponse');
const Name = require('../models/Name');
const User = require('../models/User');
const UploadLog = require('../models/UploadLog');
const cache = require('../utils/cache');
const xlsx = require('xlsx');
const { v4: uuidv4 } = require('uuid');

// @desc    Bulk import names from Excel
// @route   POST /api/v1/admin/names/upload-excel
// @access  Private/Admin
exports.uploadExcel = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ErrorResponse('Please upload a file', 400));
        }

        const fileBuffer = req.file.buffer;
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet, { range: 1 });

        const batchId = uuidv4();
        let successCount = 0;
        let errorCount = 0;
        const errors = [];
        const validNames = [];

        data.forEach((row, index) => {
            const rowNumber = index + 3; // +1 for 0-index, +1 for group row, +1 for header row

            // Helper to find value regardless of '*' suffix or slight variations
            const getValue = (keyBase) => {
                const key = Object.keys(row).find(k => k.toLowerCase().startsWith(keyBase.toLowerCase()));
                return key ? row[key] : null;
            };

            const nameEn = getValue('name_en');
            const nameAr = getValue('name_ar');
            const gender = getValue('gender');
            const meaningEn = getValue('meaning_en');

            // Minimal validation based on PRD requirements
            if (!nameEn || !nameAr || !gender || !meaningEn) {
                errorCount++;
                errors.push({
                    row: rowNumber,
                    message: `Missing required fields: ${[!nameEn && 'name_en', !nameAr && 'name_ar', !gender && 'gender', !meaningEn && 'meaning_en'].filter(Boolean).join(', ')}`
                });
                return; // Skip this row
            }

            // Mapping from Excel columns to Mongoose Schema
            const nameDoc = {
                nameEnglish: String(nameEn).trim(),
                nameArabic: String(nameAr).trim(),
                gender: String(gender).toLowerCase().trim(),
                meaning: String(meaningEn).trim(),
                origin: getValue('origin'),
                pronunciation: getValue('pronunciation'),
                isQuranic: String(getValue('is_quranic') || '').toLowerCase() === 'yes',
                isPremium: String(getValue('plan_tier') || '').toLowerCase() === 'premium',
                isActive: String(getValue('status') || '').toLowerCase() !== 'draft',
                uploadBatchId: batchId
            };

            // Quran reference (nested)
            if (row['quran_surah'] || row['quran_ayah'] || row['quran_text_ar']) {
                nameDoc.quranReference = {
                    surah: row['quran_surah'],
                    verse: row['quran_ayah'],
                    text: row['quran_text_ar']
                };
            }

            let fullHistory = row['notes'] ? `${row['notes']}\n\n` : '';

            // Famous Personalities
            nameDoc.famousPersonalities = [];
            for (let i = 1; i <= 3; i++) {
                const holderName = row[`history_holder_${i}`];
                const holderDesc = row[`holder_${i}_description`];
                const bornYear = row[`holder_${i}_born_year`];
                if (holderName || holderDesc) {
                    nameDoc.famousPersonalities.push({
                        name: holderName || 'Unknown',
                        description: `${holderDesc || ''} (Born: ${bornYear || 'Unknown'})`.trim()
                    });
                    fullHistory += `${holderName}: ${holderDesc || ''}\n`;
                }
            }

            nameDoc.history = fullHistory.trim();

            // Birth Guidance
            const hijri1 = row['birth_month_hijri_1'];
            const greg1 = row['birth_month_greg_1'];
            if (hijri1 || greg1) {
                nameDoc.birthGuidance = `Recommended months: ${hijri1 || ''} / ${greg1 || ''}`;
            }

            validNames.push(nameDoc);
            successCount++;
        });

        // Insert valid names and get actual success count
        let actualSuccessCount = 0;
        if (validNames.length > 0) {
            try {
                const insertedDocs = await Name.insertMany(validNames, { ordered: false });
                actualSuccessCount = insertedDocs.length;
            } catch (err) {
                // If some failed (e.g. duplicates), Mongoose still returns insertedDocs in the error object
                if (err.insertedDocs) {
                    actualSuccessCount = err.insertedDocs.length;
                    // We could also log skipped duplicates here if needed
                } else {
                    throw err;
                }
            }
        }

        // Log upload results
        const log = await UploadLog.create({
            adminId: req.user.id,
            fileName: req.file.originalname,
            totalRows: data.length,
            successCount: actualSuccessCount,
            errorCount,
            errors,
            batchId
        });

        res.status(200).json({
            success: true,
            data: log
        });

    } catch (err) {
        console.error(err);
        next(new ErrorResponse('Error processing excel file', 500));
    }
};

// @desc    View import history
// @route   GET /api/v1/admin/names/upload-logs
// @access  Private/Admin
exports.getUploadLogs = async (req, res, next) => {
    try {
        const logs = await UploadLog.find().sort({ createdAt: -1 }).populate('adminId', 'name email');

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get dashboard analytics
// @route   GET /api/v1/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalNames = await Name.countDocuments();
        const premiumNames = await Name.countDocuments({ isPremium: true });

        // Get recent logs
        const recentUploads = await UploadLog.find().sort({ createdAt: -1 }).limit(5);

        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: firstDay } });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalNames,
                premiumNames,
                recentUploads,
                newUsersThisMonth
            }
        });
    } catch (err) {
        console.error('Analytics Error:', err);
        next(err);
    }
};

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        next(err);
    }
};

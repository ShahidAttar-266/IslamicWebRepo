const ErrorResponse = require('../utils/errorResponse');
const BugReport = require('../models/BugReport');

// @desc    Submit a bug report
// @route   POST /api/v1/bugs/report
// @access  Public
exports.reportBug = async (req, res, next) => {
    try {
        const { 
            name, 
            email, 
            title, 
            description, 
            deviceType, 
            browser, 
            severity,
            screenshot 
        } = req.body;

        // Create report
        const report = await BugReport.create({
            name,
            email,
            title,
            description,
            deviceType,
            browser,
            severity,
            screenshot,
            user: req.user ? req.user.id : null
        });

        res.status(201).json({
            success: true,
            message: 'Bug report submitted successfully',
            data: report
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all bug reports (Admin only)
// @route   GET /api/v1/bugs
// @access  Private/Admin
exports.getBugReports = async (req, res, next) => {
    try {
        const reports = await BugReport.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update bug report status
// @route   PUT /api/v1/bugs/:id
// @access  Private/Admin
exports.updateBugStatus = async (req, res, next) => {
    try {
        const report = await BugReport.findByIdAndUpdate(req.params.id, {
            status: req.body.status
        }, {
            new: true,
            runValidators: true
        });

        if (!report) {
            return next(new ErrorResponse(`No report found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (err) {
        next(err);
    }
};
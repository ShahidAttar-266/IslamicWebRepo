/**
 * remove_duplicates.js
 *
 * Removes duplicate names from the database, keeping the most
 * recently updated (or most complete) record in each duplicate group.
 *
 * Usage:
 *   node remove_duplicates.js              # Interactive — asks for confirmation
 *   node remove_duplicates.js --force      # Skip confirmation, delete immediately
 *   node remove_duplicates.js --keep=oldest # Keep the oldest record instead of newest
 *
 * IMPORTANT: Run "node find_duplicates.js" first to review what will be deleted.
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const readline = require('readline');
const Name = require('./src/models/Name');

const FORCE_MODE = process.argv.includes('--force');
const KEEP_OLDEST = process.argv.includes('--keep=oldest');

/**
 * Normalize a name for comparison purposes.
 * @param {string} name - The raw name string.
 * @returns {string} The normalized name.
 */
const normalizeName = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[-']/g, '')
        .replace(/\s+/g, ' ');
};

/**
 * Calculate a "completeness score" for a name document.
 * Higher score = more fields are populated.
 * @param {object} doc - A lean Name document.
 * @returns {number} The completeness score.
 */
const completenessScore = (doc) => {
    let score = 0;
    if (doc.nameEnglish) score += 1;
    if (doc.nameArabic) score += 1;
    if (doc.nameUrdu) score += 1;
    if (doc.meaning) score += 1;
    if (doc.origin) score += 1;
    if (doc.history) score += 2;          // weighted: history is valuable
    if (doc.pronunciation) score += 1;
    if (doc.variants && doc.variants.length > 0) score += 1;
    if (doc.quranReference && doc.quranReference.surah) score += 2;
    if (doc.famousPersonalities && doc.famousPersonalities.length > 0) score += 2;
    if (doc.birthGuidance) score += 1;
    if (doc.tags && doc.tags.length > 0) score += 1;
    if (doc.slug) score += 1;
    return score;
};

/**
 * Pick the best document to keep from a group of duplicates.
 * Priority: highest completeness score → most recently updated.
 * @param {Array} docs - Array of duplicate documents.
 * @returns {object} The document to keep.
 */
const pickBestDocument = (docs) => {
    return docs.sort((a, b) => {
        const scoreA = completenessScore(a);
        const scoreB = completenessScore(b);

        // Primary: completeness score (higher is better)
        if (scoreB !== scoreA) {
            return scoreB - scoreA;
        }

        // Secondary: date preference
        const dateA = new Date(a.updatedAt || a.createdAt);
        const dateB = new Date(b.updatedAt || b.createdAt);

        if (KEEP_OLDEST) {
            return dateA - dateB; // oldest first
        }
        return dateB - dateA; // newest first (default)
    })[0];
};

/**
 * Prompt the user for yes/no confirmation.
 * @param {string} question - The question to ask.
 * @returns {Promise<boolean>} True if user confirms.
 */
const askConfirmation = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.toLowerCase().startsWith('y'));
        });
    });
};

/**
 * Main cleanup logic.
 */
const removeDuplicates = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database.\n');

        const allNames = await Name.find({}).lean();
        const totalBefore = allNames.length;
        console.log(`Total names in database: ${totalBefore}\n`);

        // Group by normalized nameEnglish + gender
        const groups = {};
        for (const doc of allNames) {
            const key = `${normalizeName(doc.nameEnglish)}__${doc.gender}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(doc);
        }

        // Find duplicates
        const duplicateGroups = Object.entries(groups)
            .filter(([, docs]) => docs.length > 1)
            .map(([key, docs]) => {
                const [normalizedName, gender] = key.split('__');
                const best = pickBestDocument(docs);
                const toRemove = docs.filter((d) => !d._id.equals(best._id));
                return { normalizedName, gender, count: docs.length, keep: best, remove: toRemove };
            });

        if (duplicateGroups.length === 0) {
            console.log('✅ No duplicates found! Database is clean.\n');
            process.exit(0);
        }

        const totalToRemove = duplicateGroups.reduce((sum, g) => sum + g.remove.length, 0);

        console.log('═'.repeat(60));
        console.log('  DUPLICATE REMOVAL PLAN');
        console.log('═'.repeat(60));
        console.log(`  Duplicate groups    : ${duplicateGroups.length}`);
        console.log(`  Records to DELETE   : ${totalToRemove}`);
        console.log(`  Records to KEEP     : ${totalBefore - totalToRemove}`);
        console.log('═'.repeat(60));

        // Print preview of first 10 groups
        const previewCount = Math.min(duplicateGroups.length, 10);
        console.log(`\nPreview (first ${previewCount} groups):\n`);

        for (let i = 0; i < previewCount; i++) {
            const group = duplicateGroups[i];
            console.log(
                `  "${group.keep.nameEnglish}" (${group.gender}) → ` +
                `${group.count} copies, removing ${group.remove.length}, ` +
                `keeping _id: ${group.keep._id}`
            );
        }

        if (duplicateGroups.length > previewCount) {
            console.log(`  ... and ${duplicateGroups.length - previewCount} more groups`);
        }

        // Confirm
        if (!FORCE_MODE) {
            console.log('');
            const confirmed = await askConfirmation(
                `⚠️  This will permanently delete ${totalToRemove} records. Continue? (y/N): `
            );
            if (!confirmed) {
                console.log('\n❌ Aborted. No records were deleted.\n');
                process.exit(0);
            }
        }

        // Collect all IDs to remove
        const idsToRemove = duplicateGroups.flatMap((g) => g.remove.map((d) => d._id));

        console.log(`\nDeleting ${idsToRemove.length} duplicate records...`);

        const result = await Name.deleteMany({ _id: { $in: idsToRemove } });

        const totalAfter = await Name.countDocuments();

        console.log('\n' + '═'.repeat(60));
        console.log('  CLEANUP COMPLETE');
        console.log('═'.repeat(60));
        console.log(`  Records deleted  : ${result.deletedCount}`);
        console.log(`  Records before   : ${totalBefore}`);
        console.log(`  Records after    : ${totalAfter}`);
        console.log('═'.repeat(60));
        console.log('\n✅ Duplicates removed successfully!\n');

        process.exit(0);
    } catch (error) {
        console.error('Error removing duplicates:', error);
        process.exit(1);
    }
};

removeDuplicates();

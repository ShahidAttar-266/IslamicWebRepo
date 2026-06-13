/**
 * check_duplicates_quick.js
 *
 * Quick health-check script that reports the count of duplicate
 * names without full details. Useful for periodic monitoring.
 *
 * Usage:
 *   node check_duplicates_quick.js
 *
 * Exit codes:
 *   0 = no duplicates found
 *   1 = error
 *   2 = duplicates exist
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Name = require('./src/models/Name');

const EXIT_CODE_CLEAN = 0;
const EXIT_CODE_ERROR = 1;
const EXIT_CODE_DUPLICATES = 2;

const checkDuplicates = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.\n');

        // Use MongoDB aggregation for efficiency
        const duplicates = await Name.aggregate([
            {
                $group: {
                    _id: {
                        name: { $toLower: { $trim: { input: '$nameEnglish' } } },
                        gender: '$gender',
                    },
                    count: { $sum: 1 },
                    ids: { $push: '$_id' },
                },
            },
            {
                $match: { count: { $gt: 1 } },
            },
            {
                $sort: { count: -1 },
            },
        ]);

        const totalNames = await Name.countDocuments();
        const totalDuplicateRecords = duplicates.reduce((sum, g) => sum + (g.count - 1), 0);

        console.log('═'.repeat(50));
        console.log('  DATABASE HEALTH CHECK — DUPLICATES');
        console.log('═'.repeat(50));
        console.log(`  Total names        : ${totalNames}`);
        console.log(`  Duplicate groups   : ${duplicates.length}`);
        console.log(`  Extra records      : ${totalDuplicateRecords}`);
        console.log('═'.repeat(50));

        if (duplicates.length === 0) {
            console.log('\n  ✅ No duplicates. Database is clean!\n');
            process.exit(EXIT_CODE_CLEAN);
        }

        console.log('\n  Top duplicates:\n');
        const topCount = Math.min(duplicates.length, 15);

        for (let i = 0; i < topCount; i++) {
            const group = duplicates[i];
            console.log(`    "${group._id.name}" (${group._id.gender}) — ${group.count} copies`);
        }

        if (duplicates.length > topCount) {
            console.log(`    ... and ${duplicates.length - topCount} more`);
        }

        console.log(`\n  ⚠️  Run "node find_duplicates.js" for full details.`);
        console.log(`  ⚠️  Run "node remove_duplicates.js" to clean up.\n`);

        process.exit(EXIT_CODE_DUPLICATES);
    } catch (error) {
        console.error('Error checking duplicates:', error);
        process.exit(EXIT_CODE_ERROR);
    }
};

checkDuplicates();

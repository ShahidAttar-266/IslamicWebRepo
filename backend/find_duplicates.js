/**
 * find_duplicates.js
 *
 * Dry-run script to detect duplicate names in the database.
 * Groups by normalized nameEnglish + gender and reports all
 * duplicate groups with details. Does NOT delete anything.
 *
 * Usage:
 *   node find_duplicates.js              # Console report
 *   node find_duplicates.js --csv        # Also export to CSV file
 *   node find_duplicates.js --json       # Also export to JSON file
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Name = require('./src/models/Name');

const EXPORT_CSV = process.argv.includes('--csv');
const EXPORT_JSON = process.argv.includes('--json');

/**
 * Normalize a name for comparison purposes.
 * Lowercases, trims, collapses whitespace, and strips hyphens.
 * @param {string} name - The raw name string.
 * @returns {string} The normalized name.
 */
const normalizeName = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[-']/g, '')      // strip hyphens and apostrophes
        .replace(/\s+/g, ' ');     // collapse multiple spaces
};

/**
 * Find all duplicate name groups using MongoDB aggregation.
 * @returns {Promise<Array>} Array of duplicate group objects.
 */
const findDuplicateGroups = async () => {
    const allNames = await Name.find({})
        .select('nameEnglish nameArabic gender meaning slug isActive createdAt updatedAt')
        .lean();

    console.log(`\nTotal names in database: ${allNames.length}\n`);

    // Group by normalized nameEnglish + gender
    const groups = {};
    for (const doc of allNames) {
        const key = `${normalizeName(doc.nameEnglish)}__${doc.gender}`;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(doc);
    }

    // Filter to only groups with more than one entry (duplicates)
    const duplicateGroups = Object.entries(groups)
        .filter(([, docs]) => docs.length > 1)
        .map(([key, docs]) => {
            const [normalizedName, gender] = key.split('__');
            // Sort: most recently updated first
            docs.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
            return {
                normalizedName,
                gender,
                count: docs.length,
                keepCandidate: docs[0], // most recently updated
                duplicates: docs.slice(1),
                allDocs: docs,
            };
        })
        .sort((a, b) => b.count - a.count); // most duplicates first

    return duplicateGroups;
};

/**
 * Print a readable console report of duplicate groups.
 * @param {Array} groups - The duplicate groups array.
 */
const printReport = (groups) => {
    const totalDuplicateRecords = groups.reduce((sum, g) => sum + g.duplicates.length, 0);

    console.log('═'.repeat(70));
    console.log('  DUPLICATE NAMES REPORT (DRY RUN — NO DELETIONS)');
    console.log('═'.repeat(70));
    console.log(`  Duplicate groups found : ${groups.length}`);
    console.log(`  Total extra records    : ${totalDuplicateRecords}`);
    console.log('═'.repeat(70));

    if (groups.length === 0) {
        console.log('\n  ✅ No duplicates found! Your database is clean.\n');
        return;
    }

    groups.forEach((group, index) => {
        console.log(`\n─── Group ${index + 1} ── "${group.allDocs[0].nameEnglish}" (${group.gender}) ── ${group.count} copies ───`);

        group.allDocs.forEach((doc, docIndex) => {
            const isKeep = docIndex === 0;
            const marker = isKeep ? '✅ KEEP' : '❌ REMOVE';
            const dateStr = new Date(doc.updatedAt || doc.createdAt).toLocaleDateString();

            console.log(`  ${marker}  _id: ${doc._id}`);
            console.log(`          English : ${doc.nameEnglish}`);
            console.log(`          Arabic  : ${doc.nameArabic}`);
            console.log(`          Meaning : ${(doc.meaning || '').substring(0, 60)}...`);
            console.log(`          Slug    : ${doc.slug || '(none)'}`);
            console.log(`          Active  : ${doc.isActive}`);
            console.log(`          Date    : ${dateStr}`);
        });
    });

    console.log('\n' + '═'.repeat(70));
    console.log(`  SUMMARY: ${totalDuplicateRecords} records can be safely removed.`);
    console.log(`  Run "node remove_duplicates.js" to clean them up.`);
    console.log('═'.repeat(70) + '\n');
};

/**
 * Export duplicate groups to a CSV file.
 * @param {Array} groups - The duplicate groups array.
 */
const exportCSV = (groups) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(__dirname, `duplicates_report_${timestamp}.csv`);

    const header = 'Group,Action,ID,NameEnglish,NameArabic,Gender,Meaning,Slug,Active,Date\n';
    const rows = groups.flatMap((group, groupIndex) =>
        group.allDocs.map((doc, docIndex) => {
            const action = docIndex === 0 ? 'KEEP' : 'REMOVE';
            const date = new Date(doc.updatedAt || doc.createdAt).toISOString();
            const meaning = (doc.meaning || '').replace(/"/g, '""');
            return `${groupIndex + 1},${action},${doc._id},"${doc.nameEnglish}","${doc.nameArabic}",${doc.gender},"${meaning}","${doc.slug || ''}",${doc.isActive},${date}`;
        })
    );

    fs.writeFileSync(filePath, header + rows.join('\n'), 'utf-8');
    console.log(`📄 CSV report saved to: ${filePath}`);
};

/**
 * Export duplicate groups to a JSON file.
 * @param {Array} groups - The duplicate groups array.
 */
const exportJSON = (groups) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(__dirname, `duplicates_report_${timestamp}.json`);

    const output = groups.map((group, index) => ({
        group: index + 1,
        name: group.normalizedName,
        gender: group.gender,
        count: group.count,
        keepId: group.keepCandidate._id,
        removeIds: group.duplicates.map((d) => d._id),
        records: group.allDocs.map((doc, docIndex) => ({
            action: docIndex === 0 ? 'KEEP' : 'REMOVE',
            _id: doc._id,
            nameEnglish: doc.nameEnglish,
            nameArabic: doc.nameArabic,
            gender: doc.gender,
            slug: doc.slug,
            isActive: doc.isActive,
            date: doc.updatedAt || doc.createdAt,
        })),
    }));

    fs.writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`📄 JSON report saved to: ${filePath}`);
};

const main = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database.');

        const groups = await findDuplicateGroups();
        printReport(groups);

        if (EXPORT_CSV) {
            exportCSV(groups);
        }
        if (EXPORT_JSON) {
            exportJSON(groups);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error finding duplicates:', error);
        process.exit(1);
    }
};

main();

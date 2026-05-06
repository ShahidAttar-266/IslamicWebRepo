require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const Name = require('./src/models/Name');

const importExcel = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Database');

    const excelPath = path.join(__dirname, '../names_database_only.xlsx');
    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Skip the first two rows (headers)
    const rows = data.slice(2);
    
    const namesToInsert = rows.map(row => {
      if (!row[0] || !row[1]) return null; // Skip empty rows

      const famousPersonalities = [];
      if (row[12]) famousPersonalities.push({ name: row[12], description: row[15] || '' });
      if (row[16]) famousPersonalities.push({ name: row[16], description: row[19] || '' });
      if (row[20]) famousPersonalities.push({ name: row[20], description: row[23] || '' });

      return {
        nameEnglish: String(row[0]).trim(),
        nameArabic: String(row[1]).trim(),
        gender: String(row[2]).toLowerCase().trim(),
        meaning: String(row[3]).trim(),
        origin: row[5] ? String(row[5]).trim() : '',
        pronunciation: row[7] ? String(row[7]).trim() : '',
        isQuranic: String(row[8]).toLowerCase() === 'yes',
        quranReference: {
          surah: row[9] ? String(row[9]).trim() : '',
          verse: row[10] ? String(row[10]).trim() : '',
          text: row[11] ? String(row[11]).trim() : ''
        },
        famousPersonalities,
        isPremium: String(row[29]).toLowerCase() === 'pro',
        isActive: String(row[30]).toLowerCase() === 'published'
      };
    }).filter(item => item !== null);

    console.log(`Prepared ${namesToInsert.length} names for insertion.`);

    // Clear existing
    await Name.deleteMany();
    console.log('Cleared existing names.');

    // Insert
    await Name.insertMany(namesToInsert);
    console.log('Successfully imported names from Excel!');

    process.exit(0);
  } catch (error) {
    console.error('Error importing names:', error);
    process.exit(1);
  }
};

importExcel();
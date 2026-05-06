const xlsx = require('xlsx');

const workbook = xlsx.readFile('../names_database_only.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

if (data.length > 0) {
  console.log('Headers:', data[0]);
  console.log('First Row:', data[1]);
} else {
  console.log('Sheet is empty');
}

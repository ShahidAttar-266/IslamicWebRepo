const xlsx = require('xlsx');

const workbook = xlsx.readFile('../names_database_only.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
// Skip the first row (index 0) which is 'Core Information', etc.
const data = xlsx.utils.sheet_to_json(sheet, { range: 1 });

if (data.length > 0) {
  console.log('First Data Row:', data[0]);
} else {
  console.log('Sheet is empty');
}
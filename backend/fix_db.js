require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Name = require('./src/models/Name');

const fixActive = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Name.updateMany({}, { isActive: true });
    console.log('Successfully set isActive=true for all names in the database.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixActive();
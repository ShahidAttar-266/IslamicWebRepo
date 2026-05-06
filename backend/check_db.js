require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Name = require('./src/models/Name');

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const names = await Name.find({});
    console.log(`Total names in DB: ${names.length}`);
    names.forEach(name => {
      console.log(`- ${name.nameEnglish} (isActive: ${name.isActive})`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkDB();
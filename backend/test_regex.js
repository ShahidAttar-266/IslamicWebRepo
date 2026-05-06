require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Name = require('./src/models/Name');

const testQuery = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    let parsedQuery = { isActive: true };
    const letter = 'A';
    parsedQuery.nameEnglish = { $regex: `^${letter}`, $options: 'i' };

    console.log("Query object:", JSON.stringify(parsedQuery));

    const names = await Name.find(parsedQuery);
    console.log(`Found: ${names.length}`);
    if (names.length > 0) {
      console.log(names.map(n => n.nameEnglish));
    }
    
    // Check what is in DB
    const allNames = await Name.find({ nameEnglish: /A/i });
    console.log(`Names with A anywhere: ${allNames.length}`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testQuery();
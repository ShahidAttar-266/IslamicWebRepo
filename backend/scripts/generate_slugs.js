require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Name = require('./src/models/Name');

const generateSlugs = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected. Finding all names...');

    const names = await Name.find({});
    console.log(`Found ${names.length} names. Generating slugs...`);

    let updatedCount = 0;
    for (let i = 0; i < names.length; i++) {
      const nameDoc = names[i];
      
      // Setting nameDoc.slug = undefined or checking if it's already set
      // Let's force generate a slug for all of them to make sure it's set correctly
      // The save hook will handle slug generation if it's modified or missing
      if (!nameDoc.slug) {
        // Trigger save to run pre-save hook
        await nameDoc.save();
        updatedCount++;
        if (updatedCount % 100 === 0) {
          console.log(`Processed ${updatedCount}/${names.length} names...`);
        }
      }
    }

    console.log(`Successfully generated slugs for ${updatedCount} names.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

generateSlugs();

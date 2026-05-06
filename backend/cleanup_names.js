require('dotenv').config();
const mongoose = require('mongoose');
const Name = require('./src/models/Name');

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const namesToDelete = ['Ahmad', 'Ibrahim', 'Yusuf', 'Sulaiman', 'Dawud', 'Aisha', 'Zainab', 'Maryam', 'Fatima'];
        const result = await Name.deleteMany({ nameEnglish: { $in: namesToDelete } });
        console.log(`Deleted ${result.deletedCount} names.`);
        
        const remainingCount = await Name.countDocuments();
        console.log(`Remaining names in database: ${remainingCount}`);
        
        const sample = await Name.find({}).limit(10);
        console.log('Sample of remaining names:');
        sample.forEach(n => console.log(`- ${n.nameEnglish} (${n.nameArabic})`));
        
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

cleanup();
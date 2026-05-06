require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Name = require('./src/models/Name');

const testControllerLogic = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Simulate req object
    const req = {
        query: { letter: 'A' }
    };
    
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit', 'q', 'letter', 'quranic'];
    removeFields.forEach(param => delete reqQuery[param]);
    
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    let parsedQuery = JSON.parse(queryStr);
    parsedQuery.isActive = true;
    
    if (req.query.q) {
        parsedQuery.$text = { $search: req.query.q };
    }
    if (req.query.letter) {
        parsedQuery.nameEnglish = { $regex: `^${req.query.letter}`, $options: 'i' };
    }
    if (req.query.quranic === 'true') {
        parsedQuery.$or = [
            { isQuranic: true },
            { 'quranReference.surah': { $exists: true, $ne: '' } }
        ];
    }
    
    console.log('Final parsedQuery:', parsedQuery);
    const names = await Name.find(parsedQuery);
    console.log('Found names:', names.length);
    process.exit(0);
};

testControllerLogic();
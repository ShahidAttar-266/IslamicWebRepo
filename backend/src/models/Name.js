const mongoose = require('mongoose');

const nameSchema = new mongoose.Schema({
    nameEnglish: {
        type: String,
        required: [true, 'Please add an English name'],
        trim: true,
    },
    nameArabic: {
        type: String,
        required: [true, 'Please add an Arabic name'],
        trim: true
    },
    nameUrdu: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ['boy', 'girl', 'unisex'],
        required: true
    },
    meaning: {
        type: String,
        required: [true, 'Please add a meaning'],
        trim: true
    },
    origin: {
        type: String,
        trim: true
    },
    history: {
        type: String,
        trim: true
    },
    pronunciation: {
        type: String,
        trim: true
    },
    variants: [{
        type: String,
        trim: true
    }],
    quranReference: {
        surah: String,
        verse: String,
        text: String
    },
    famousPersonalities: [{
        name: String,
        description: String
    }],
    birthGuidance: String,
    tags: [{
        type: String,
        trim: true
    }],
    isQuranic: {
        type: Boolean,
        default: false
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    uploadBatchId: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes based on PRD
nameSchema.index({ nameEnglish: 'text', meaning: 'text', tags: 'text' });
nameSchema.index({ gender: 1, isPremium: 1, isActive: 1 });

module.exports = mongoose.model('Name', nameSchema);
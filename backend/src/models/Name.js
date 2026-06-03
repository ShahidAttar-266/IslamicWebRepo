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
    arabicRoot: {
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
    isActive: {
        type: Boolean,
        default: true
    },
    slug: {
        type: String,
        unique: true
    },
    uploadBatchId: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes based on PRD
nameSchema.index({ nameEnglish: 'text', nameArabic: 'text', nameUrdu: 'text', meaning: 'text', tags: 'text' });
nameSchema.index({ nameEnglish: 1 }); // For alphabetical sorting and prefix regex
nameSchema.index({ gender: 1, isActive: 1 });
nameSchema.index({ origin: 1, isActive: 1 });
nameSchema.index({ isQuranic: 1, isActive: 1 });
nameSchema.index({ createdAt: -1 }); // For 'Recently Added' sorting

module.exports = mongoose.model('Name', nameSchema);

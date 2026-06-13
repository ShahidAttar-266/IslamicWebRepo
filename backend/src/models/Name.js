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
    isActive: {
        type: Boolean,
        default: true
    },
    uploadBatchId: {
        type: String
    },
    slug: {
        type: String,
        trim: true,
        lowercase: true
    }
}, {
    timestamps: true
});

// Pre-save hook to generate unique slug
nameSchema.pre('save', async function (next) {
    if (this.isModified('nameEnglish') || !this.slug) {
        let baseSlug = this.nameEnglish
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
            .replace(/\s+/g, '-')         // replace spaces with -
            .replace(/-+/g, '-');         // remove duplicate -

        let generatedSlug = baseSlug;
        let counter = 1;
        
        // Find existing names with the same slug (excluding current document)
        while (true) {
            const existing = await mongoose.models.Name.findOne({ 
                slug: generatedSlug, 
                _id: { $ne: this._id } 
            });
            if (!existing) {
                break;
            }
            generatedSlug = `${baseSlug}-${counter}`;
            counter++;
        }
        this.slug = generatedSlug;
    }
    next();
});

// Indexes based on PRD
nameSchema.index({ nameEnglish: 'text', meaning: 'text', tags: 'text' });
nameSchema.index({ nameEnglish: 1 }); // For alphabetical sorting and prefix regex
nameSchema.index({ slug: 1 }, { unique: true, sparse: true }); // For slug-based queries
nameSchema.index({ gender: 1, isActive: 1 });
nameSchema.index({ origin: 1, isActive: 1 });
nameSchema.index({ isQuranic: 1, isActive: 1 });
nameSchema.index({ createdAt: -1 }); // For 'Recently Added' sorting
nameSchema.index(
    { nameEnglish: 1, gender: 1 },
    { unique: true, collation: { locale: 'en', strength: 2 } }
); // Prevent duplicate name+gender (case-insensitive)

module.exports = mongoose.model('Name', nameSchema);
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    category: {
        type: String,
        trim: true,
        default: 'General'
    },
    price: {
        type: String,
        trim: true,
        default: ''
    },
    affiliateUrl: {
        type: String,
        trim: true,
        default: ''
    },
    affiliateLinks: [{
        label: {
            type: String,
            trim: true,
            default: 'Buy Now'
        },
        url: {
            type: String,
            required: [true, 'Please add a link URL'],
            trim: true
        },
        countryCode: {
            type: String,
            trim: true,
            default: ''
        }
    }],
    imageUrl: {
        type: String,
        trim: true,
        default: ''
    },
    icon: {
        type: String,
        trim: true,
        default: 'shopping-bag'
    },
    gradient: {
        type: String,
        trim: true,
        default: '135deg,#1A3A1A,#2D6A2D'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

productSchema.index({ isActive: 1, sortOrder: 1 });
productSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);

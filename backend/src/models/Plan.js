const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'usd'
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'yearly'],
        required: true
    },
    stripePriceId: {
        type: String,
        required: true
    },
    features: [{
        type: String
    }],
    maxNames: {
        type: Number,
        default: null // null means unlimited
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Plan', planSchema);
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    razorpaySubscriptionId: {
        type: String,
        unique: true,
        sparse: true
    },
    razorpayPaymentId: {
        type: String
    },
    planType: {
        type: String,
        enum: ['premium'],
        required: true
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'yearly'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'past_due', 'trialing'],
        required: true
    },
    isManual: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    cancelledAt: {
        type: Date
    }
}, {
    timestamps: true
});

subscriptionSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
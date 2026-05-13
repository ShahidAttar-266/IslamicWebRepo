const mongoose = require('mongoose');

const bugReportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add your name']
    },
    email: {
        type: String,
        required: [true, 'Please add your email']
    },
    title: {
        type: String,
        required: [true, 'Please add a bug title'],
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a bug description']
    },
    deviceType: {
        type: String,
        default: 'Unknown'
    },
    browser: {
        type: String,
        default: 'Unknown'
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    screenshot: {
        type: String, // URL to screenshot (Cloudinary or local)
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved', 'closed'],
        default: 'pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional: user might not be logged in
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BugReport', bugReportSchema);
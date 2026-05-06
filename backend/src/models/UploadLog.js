const mongoose = require('mongoose');

const uploadLogSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    totalRows: {
        type: Number,
        default: 0
    },
    successCount: {
        type: Number,
        default: 0
    },
    errorCount: {
        type: Number,
        default: 0
    },
    errors: [{
        row: Number,
        message: String
    }],
    batchId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

uploadLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('UploadLog', uploadLogSchema);
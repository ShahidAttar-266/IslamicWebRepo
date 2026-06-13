const express = require('express');
const multer = require('multer');

const {
    uploadExcel,
    getUploadLogs,
    getAnalytics,
    getUsers,
    getDuplicates,
    removeDuplicates
} = require('../controllers/admin.controller');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Memory storage for multer (since we parse it immediately)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
    fileFilter: (req, file, cb) => {
        const ok = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ].includes(file.mimetype);
        
        if (ok) {
            cb(null, true);
        } else {
            cb(new Error('Only .xlsx/.xls files are allowed'), false);
        }
    }
});

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/names/duplicates', getDuplicates);
router.delete('/names/duplicates', removeDuplicates);
router.post('/names/upload-excel', upload.single('file'), uploadExcel);
router.get('/names/upload-logs', getUploadLogs);
router.get('/analytics', getAnalytics);
router.get('/users', getUsers);

module.exports = router;
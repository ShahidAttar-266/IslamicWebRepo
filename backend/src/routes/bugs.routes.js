const express = require('express');
const {
    reportBug,
    getBugReports,
    updateBugStatus
} = require('../controllers/bugs.controller');

const { protect, authorize } = require('../middlewares/auth');
const optionalProtect = require('../middlewares/optionalProtect');

const router = express.Router();

// Submit report (optional auth to link user ID)
router.post('/report', optionalProtect, reportBug);

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.get('/', getBugReports);
router.put('/:id', updateBugStatus);

module.exports = router;
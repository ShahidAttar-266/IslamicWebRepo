const express = require('express');
const {
    register,
    login,
    logout,
    getMe,
    updateDetails
} = require('../controllers/auth.controller');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateDetails);

module.exports = router;
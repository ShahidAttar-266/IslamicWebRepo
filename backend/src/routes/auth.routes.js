const express = require('express');
const {
    register,
    login,
    googleLogin,
    getMe,
    logout,
    updateDetails
} = require('../controllers/auth.controller');

const router = express.Router();

const { protect } = require('../middlewares/auth');
const { loginLimiter, registerLimiter, googleLimiter } = require('../middlewares/rateLimiter');

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/google', googleLimiter, googleLogin);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateDetails);

module.exports = router;
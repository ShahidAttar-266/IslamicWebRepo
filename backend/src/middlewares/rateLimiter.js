const rateLimit = require('express-rate-limit');

// Helper to determine the max limit for auth routes
const getAuthMaxLimit = () => {
    if (process.env.AUTH_RATE_LIMIT) {
        return parseInt(process.env.AUTH_RATE_LIMIT, 10);
    }
    return (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') ? 100 : 5;
};

// Rate limiter for login route (5 attempts / 15 mins in production)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: getAuthMaxLimit(),
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            error: 'Too many login attempts, please try again after 15 minutes.'
        });
    }
});

// Rate limiter for registration route (5 attempts / 15 mins in production)
const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: getAuthMaxLimit(),
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            error: 'Too many registration attempts, please try again after 15 minutes.'
        });
    }
});

// Rate limiter for Google auth route (5 attempts / 15 mins in production)
const googleLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: getAuthMaxLimit(),
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            error: 'Too many Google login attempts, please try again after 15 minutes.'
        });
    }
});

module.exports = {
    loginLimiter,
    registerLimiter,
    googleLimiter
};

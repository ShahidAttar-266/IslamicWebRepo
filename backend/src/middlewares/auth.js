const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const cache = require('../utils/cache');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        console.error('[DEBUG_AUTH] No token provided in headers');
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const cacheKey = `user:doc:${decoded.id}`;
        req.user = await cache.getOrSet(cacheKey, async () => {
            return await User.findById(decoded.id);
        }, 300); // 5 min TTL

        if (!req.user) {
             console.error('[DEBUG_AUTH] User not found in database for ID:', decoded.id);
             return next(new ErrorResponse('User no longer exists', 401));
        }

        if (!req.user.id) {
            req.user.id = decoded.id;
        }

        if (!req.user.isActive) {
             console.error('[DEBUG_AUTH] User account is deactivated:', req.user.email);
             return next(new ErrorResponse('User account is deactivated', 401));
        }

        next();
    } catch (err) {
        console.error('[DEBUG_AUTH] JWT Verification failed:', err.message);
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user ? req.user.role : 'guest'} is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};

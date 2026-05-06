const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

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
    // Set token from cookie
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        if (!req.user || !req.user.isActive) {
             return next(new ErrorResponse('User no longer exists or is deactivated', 401));
        }

        next();
    } catch (err) {
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

// Check subscription status
exports.checkSubscription = (...statuses) => {
    return (req, res, next) => {
        if (!req.user || !req.user.subscription || !statuses.includes(req.user.subscription.status)) {
            // Also let admin pass
            if (req.user && req.user.role === 'admin') {
                return next();
            }
            return next(
                new ErrorResponse('This content requires an active premium subscription', 403)
            );
        }
        next();
    };
}
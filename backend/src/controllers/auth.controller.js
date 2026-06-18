const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const cache = require('../utils/cache');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ... helper to get token ...
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    });

    res.status(statusCode)
        .json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};

// @desc    Google Login
// @route   POST /api/v1/auth/google
// @access  Public
exports.googleLogin = async (req, res, next) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return next(new ErrorResponse('Please provide a Google ID Token', 400));
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { name, email, sub: googleId } = ticket.getPayload();

        // 1. Find user by googleId OR email
        let user = await User.findOne({ 
            $or: [{ googleId }, { email }]
        });

        if (user) {
            // Update googleId if they had an email account but never used Google
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
                // Invalidate cache
                await cache.invalidate(`user:doc:${user._id}`);
            }
        } else {
            // 2. Create new user if not found
            user = await User.create({
                name,
                email,
                googleId,
                isActive: true
            });
        }

        if (!user.isActive) {
            return next(new ErrorResponse('User account is deactivated', 401));
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error('Google Login Error:', err);
        return next(new ErrorResponse('Google authentication failed', 401));
    }
};

// @desc    Logout user
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    if (req.user) {
        await cache.invalidate(`user:doc:${req.user.id}`);
    }

    res.status(200).json({
        success: true,
        data: {}
    });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return next(new ErrorResponse('Please provide name, email and password', 400));
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return next(new ErrorResponse('Please provide an email and password', 400));
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        if (!user.isActive) {
             return next(new ErrorResponse('User account is deactivated', 401));
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user details
// @route   PUT /api/v1/auth/me
// @access  Private
exports.updateDetails = async (req, res, next) => {
    try {
        const fieldsToUpdate = {};
        
        if (req.body.name !== undefined) {
            fieldsToUpdate.name = req.body.name;
        }

        // Prevent empty updates
        if (Object.keys(fieldsToUpdate).length === 0) {
            return next(new ErrorResponse('Please provide fields to update', 400));
        }

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        // Invalidate cache
        await cache.invalidate(`user:doc:${req.user.id}`);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};
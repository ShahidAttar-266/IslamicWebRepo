const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cache = require('../utils/cache');

const optionalProtect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const cacheKey = `user:doc:${decoded.id}`;
            req.user = await cache.getOrSet(cacheKey, async () => {
                return await User.findById(decoded.id);
            }, 300); // 5 min TTL
        } catch (err) {
            // Proceed without user if token is invalid
        }
    }
    next();
};

module.exports = optionalProtect;
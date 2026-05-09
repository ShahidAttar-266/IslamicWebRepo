const ErrorResponse = require('../utils/errorResponse');
const Name = require('../models/Name');

// @desc    Get all names (with pagination & filtering)
// @route   GET /api/v1/names
// @access  Public
exports.getNames = async (req, res, next) => {
    try {
        let query;

        // Default: Only show active names to public
        const parsedQuery = {};
        
        // If user is not admin, only show active names
        if (!req.user || req.user.role !== 'admin') {
            parsedQuery.isActive = true;
        } else if (req.query.isActive) {
            // Admin can explicitly filter by status
            parsedQuery.isActive = req.query.isActive === 'true';
        }

        // Allowed filters
        if (req.query.gender && ['boy', 'girl', 'unisex'].includes(req.query.gender)) {
            parsedQuery.gender = req.query.gender;
        }

        if (req.query.isPremium) {
            parsedQuery.isPremium = req.query.isPremium === 'true';
        }

        if (req.query.origin) {
            parsedQuery.origin = String(req.query.origin);
        }

        // Full-text search
        if (req.query.q) {
            parsedQuery.$text = { $search: String(req.query.q) };
        }

        // Alphabet filter
        if (req.query.letter) {
            const letter = String(req.query.letter).charAt(0);
            parsedQuery.nameEnglish = { $regex: `^${letter}`, $options: 'i' };
        }

        // Quranic filter
        if (req.query.quranic === 'true') {
            parsedQuery.$or = [
                { isQuranic: true },
                { 'quranReference.surah': { $exists: true, $ne: '' } }
            ];
        }

        console.log('[getNames] Query:', JSON.stringify(parsedQuery));

        query = Name.find(parsedQuery);

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        } else {
            // Default exclude premium fields for list view unless specified
            query = query.select('-history -famousPersonalities');
        }

        // Sort & Text Search Score
        if (req.query.q) {
            // Must project and sort by text score when using $text search
            query = query.select({ score: { $meta: 'textScore' } })
                         .sort({ score: { $meta: 'textScore' } });
        } else if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            // Default sort: premium first, then alphabetical English
            query = query.sort('-isPremium nameEnglish');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 200;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Name.countDocuments(parsedQuery);

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const names = await query;

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({
            success: true,
            total,
            count: names.length,
            pagination,
            data: names
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single name
// @route   GET /api/v1/names/:id
// @access  Public (Premium fields filtered if not subscribed)
exports.getName = async (req, res, next) => {
    try {
        console.log(`[GET_NAME] Fetching name with ID: ${req.params.id}`);

        // Validate ID format (prevent Mongoose CastError crash)
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return next(new ErrorResponse('Invalid ID format', 400));
        }

        const name = await Name.findById(req.params.id);

        if (!name) {
            console.log(`[GET_NAME] Name not found for ID: ${req.params.id}`);
            return next(new ErrorResponse(`Name not found with id of ${req.params.id}`, 404));
        }

        // Only allow active names to be seen unless user is admin
        if (!name.isActive && (!req.user || req.user.role !== 'admin')) {
            return next(new ErrorResponse('This name is currently under review or inactive', 403));
        }

        // Determine if user has premium access
        let hasPremiumAccess = false;
        if (req.user) {
            if (req.user.role === 'admin') {
                hasPremiumAccess = true;
            } else if (req.user.subscription && (req.user.subscription.status === 'premium' || req.user.subscription.status === 'basic')) {
                hasPremiumAccess = true;
            }
        }

        // Clone the document to manipulate it
        let responseData = name.toObject();

        // If not premium user, hide premium-only data for all names
        // But keep essential public info
        if (!hasPremiumAccess) {
             console.log(`[GET_NAME] Sanitizing premium data for guest/free user`);
             delete responseData.history;
             delete responseData.quranReference;
             delete responseData.famousPersonalities;
             delete responseData.birthGuidance;
             delete responseData.variants;
        }

        res.status(200).json({
            success: true,
            data: responseData
        });
    } catch (err) {
        console.error(`[GET_NAME_ERROR] ${err.message}`);
        next(err);
    }
};

// @desc    Create new name
// @route   POST /api/v1/names
// @access  Private/Admin
exports.createName = async (req, res, next) => {
    try {
        const name = await Name.create(req.body);

        res.status(201).json({
            success: true,
            data: name
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update name
// @route   PUT /api/v1/names/:id
// @access  Private/Admin
exports.updateName = async (req, res, next) => {
    try {
        let name = await Name.findById(req.params.id);

        if (!name) {
            return next(new ErrorResponse(`Name not found with id of ${req.params.id}`, 404));
        }

        name = await Name.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: name
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete name
// @route   DELETE /api/v1/names/:id
// @access  Private/Admin
exports.deleteName = async (req, res, next) => {
    try {
        let name = await Name.findById(req.params.id);

        if (!name) {
             return next(new ErrorResponse(`Name not found with id of ${req.params.id}`, 404));
        }

        await name.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
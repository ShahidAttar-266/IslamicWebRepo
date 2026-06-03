const ErrorResponse = require('../utils/errorResponse');
const Name = require('../models/Name');
const cache = require('../utils/cache');

// @desc    Get all names (with pagination & filtering)
// @route   GET /api/v1/names
// @access  Public
exports.getNames = async (req, res, next) => {
    try {
        const isAdmin = req.user && req.user.role === 'admin';
        
        // Build cache key from query string (sorted to avoid duplication)
        const sortedQuery = Object.keys(req.query)
            .sort()
            .map(key => `${key}=${req.query[key]}`)
            .join('&');
        const queryHash = Buffer.from(sortedQuery).toString('base64');
        const cacheKey = `names:list:${queryHash}`;

        const fetchNames = async () => {
            const parsedQuery = {};
            
            // If user is not admin, only show active names
            if (!isAdmin) {
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

            let query = Name.find(parsedQuery);

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
                query = query.select('score')
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
            const total = await Name.countDocuments(parsedQuery);

            query = query.skip(startIndex).limit(limit);

            // Executing query
            const names = await query;

            // Pagination result
            const pagination = {};
            if (startIndex + names.length < total) {
                pagination.next = { page: page + 1, limit };
            }
            if (startIndex > 0) {
                pagination.prev = { page: page - 1, limit };
            }

            return {
                total,
                count: names.length,
                pagination,
                data: names
            };
        };

        // Only cache for non-admin users to avoid leaking inactive names
        let result;
        if (!isAdmin) {
            result = await cache.getOrSet(cacheKey, fetchNames, 300); // 5 min TTL
        } else {
            result = await fetchNames();
        }

        res.status(200).json({
            success: true,
            ...result
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
        // Validate ID format
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return next(new ErrorResponse('Invalid ID format', 400));
        }

        // Determine if user has premium access
        let hasPremiumAccess = false;
        if (req.user) {
            if (req.user.role === 'admin' || (req.user.subscription && req.user.subscription.status === 'premium')) {
                hasPremiumAccess = true;
            }
        }

        const cacheKey = `names:detail:${req.params.id}${hasPremiumAccess ? ':premium' : ':public'}`;

        const fetchName = async () => {
            const name = await Name.findById(req.params.id);

            if (!name) return null;

            // Only allow active names to be seen unless user is admin
            if (!name.isActive && (!req.user || req.user.role !== 'admin')) {
                throw new Error('Name inactive');
            }

            let responseData = name.toObject();

            // If not premium user, hide premium-only data
            if (!hasPremiumAccess) {
                 delete responseData.history;
                 delete responseData.quranReference;
                 delete responseData.famousPersonalities;
                 delete responseData.birthGuidance;
                 delete responseData.variants;
            }

            return responseData;
        };

        const result = await cache.getOrSet(cacheKey, fetchName, 600); // 10 min TTL

        if (!result) {
            return next(new ErrorResponse(`Name not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        if (err.message === 'Name inactive') {
            return next(new ErrorResponse('This name is currently under review or inactive', 403));
        }
        next(err);
    }
};

// @desc    Get dynamic sitemap.xml
// @route   GET /api/v1/names/sitemap.xml
// @access  Public
exports.getSitemap = async (req, res, next) => {
    try {
        const names = await Name.find({ isActive: true }).select('_id updatedAt');
        
        const baseUrl = 'https://www.islamicnames.in';
        
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        
        // Static routes
        const staticRoutes = ['', '/search', '/pricing', '/faq', '/compare'];
        staticRoutes.forEach(route => {
            xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
        });
        
        // Dynamic name routes
        names.forEach(name => {
            xml += `  <url>\n    <loc>${baseUrl}/name/${name._id}</loc>\n    <lastmod>${name.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
        });
        
        xml += `</urlset>`;
        
        res.header('Content-Type', 'application/xml');
        res.status(200).send(xml);
    } catch (err) {
        next(err);
    }
};

// @desc    Create new name
// @route   POST /api/v1/names
// @access  Private/Admin
exports.createName = async (req, res, next) => {
    try {
        const name = await Name.create(req.body);
        await cache.invalidatePattern('names:list:*');
        res.status(201).json({ success: true, data: name });
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
        if (!name) return next(new ErrorResponse(`Name not found`, 404));

        name = await Name.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        await cache.invalidatePattern('names:list:*');
        await cache.invalidateMany([
            `names:detail:${req.params.id}:public`,
            `names:detail:${req.params.id}:premium`
        ]);

        res.status(200).json({ success: true, data: name });
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
        if (!name) return next(new ErrorResponse(`Name not found`, 404));

        await name.deleteOne();
        await cache.invalidatePattern('names:list:*');
        await cache.invalidateMany([
            `names:detail:${req.params.id}:public`,
            `names:detail:${req.params.id}:premium`
        ]);

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

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

            if (req.query.origin) {
                parsedQuery.origin = String(req.query.origin);
            }

            // Prefix search on nameEnglish + partial match on meaning/tags
            if (req.query.q) {
                const escapedQ = String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                // nameEnglish: starts-with prefix (^Ahmad matches Ahmad, Ahmadali…)
                const prefixRegex  = new RegExp(`^${escapedQ}`, 'i');
                // meaning/tags: anywhere partial match
                const partialRegex = new RegExp(escapedQ, 'i');
                parsedQuery.$or = [
                    { nameEnglish: { $regex: prefixRegex } },
                    { meaning:     { $regex: partialRegex } },
                    { tags:        { $regex: partialRegex } }
                ];
            }

            // Alphabet filter
            if (req.query.letter) {
                const letter = String(req.query.letter).charAt(0);
                parsedQuery.nameEnglish = { $regex: `^${letter}`, $options: 'i' };
            }

            // Quranic filter
            if (req.query.quranic === 'true') {
                const quranicCondition = [
                    { isQuranic: true },
                    { 'quranReference.surah': { $exists: true, $ne: '' } }
                ];
                if (parsedQuery.$or) {
                    // Combine existing $or (search) with quranic $or via $and
                    parsedQuery.$and = [
                        { $or: parsedQuery.$or },
                        { $or: quranicCondition }
                    ];
                    delete parsedQuery.$or;
                } else {
                    parsedQuery.$or = quranicCondition;
                }
            }

            let query = Name.find(parsedQuery);

            // Select Fields
            if (req.query.select) {
                const fields = req.query.select.split(',').join(' ');
                query = query.select(fields);
            }

            // Sort
            if (req.query.sort) {
                const sortBy = req.query.sort.split(',').join(' ');
                query = query.sort(sortBy);
            } else {
                // Default sort: alphabetical English
                query = query.sort('nameEnglish');
            }

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 200;
            const startIndex = (page - 1) * limit;

            query = query.skip(startIndex).limit(limit);

            // Executing count and find queries in parallel to save database roundtrips
            const [total, names] = await Promise.all([
                Name.countDocuments(parsedQuery),
                query
            ]);

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
// @access  Public
exports.getName = async (req, res, next) => {
    try {
        const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
        const isSlug = req.params.id.match(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/);

        if (!isObjectId && !isSlug) {
            return next(new ErrorResponse('Invalid ID format', 400));
        }

        const cacheKey = `names:detail:${req.params.id}:public`;

        const fetchName = async () => {
            let name;
            
            if (isObjectId) {
                name = await Name.findById(req.params.id);
            }
            
            if (!name) {
                name = await Name.findOne({ slug: req.params.id.toLowerCase() });
            }

            if (!name) return null;

            // Only allow active names to be seen unless user is admin
            if (!name.isActive && (!req.user || req.user.role !== 'admin')) {
                throw new Error('Name inactive');
            }

            return name.toObject();
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
        const names = await Name.find({ isActive: true }).select('_id slug updatedAt');
        
        const baseUrl = 'https://www.islamicnames.in';
        
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        
        // Static routes — core pages
        const staticRoutes = [
            { path: '', changefreq: 'daily', priority: '1.0' },
            { path: '/search', changefreq: 'daily', priority: '0.8' },
            { path: '/faq', changefreq: 'monthly', priority: '0.5' },
            { path: '/compare', changefreq: 'daily', priority: '0.7' },
            { path: '/blog', changefreq: 'weekly', priority: '0.9' },
            { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
            { path: '/terms', changefreq: 'yearly', priority: '0.3' },
            { path: '/disclaimer', changefreq: 'yearly', priority: '0.3' },
            { path: '/report-bug', changefreq: 'monthly', priority: '0.3' },
        ];
        staticRoutes.forEach(({ path, changefreq, priority }) => {
            xml += `  <url>\n    <loc>${baseUrl}${path}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
        });

        // Blog article routes
        const blogArticles = [
            '/blog/50-beautiful-islamic-girl-names-starting-with-f',
            '/blog/top-30-quranic-names-for-baby-boys-in-2026',
            '/blog/how-to-choose-an-islamic-name',
            '/blog/rare-islamic-boy-names-with-deep-meanings',
            '/blog/modern-arabic-girl-names-that-sound-beautiful',
            '/blog/names-meaning-light-in-the-quran',
            '/blog/50-islamic-girl-names-starting-with-s',
            '/blog/can-muslims-use-non-arabic-names',
            '/blog/names-of-the-prophets-in-islam',
            '/blog/the-name-fatima-meaning-history',
        ];
        blogArticles.forEach(article => {
            xml += `  <url>\n    <loc>${baseUrl}${article}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
        });
        
        // Dynamic name routes
        names.forEach(name => {
            xml += `  <url>\n    <loc>${baseUrl}/name/${name.slug || name._id}</loc>\n    <lastmod>${name.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
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
        await cache.invalidate('render:home');
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
            'render:home',
            `render:name:${req.params.id.toLowerCase()}`,
            name.slug ? `render:name:${name.slug.toLowerCase()}` : null
        ].filter(Boolean));

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
            'render:home',
            `render:name:${req.params.id.toLowerCase()}`,
            name.slug ? `render:name:${name.slug.toLowerCase()}` : null
        ].filter(Boolean));

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

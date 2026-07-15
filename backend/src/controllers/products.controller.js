const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all active products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res, next) => {
    try {
        const { category } = req.query;
        const filter = { isActive: true };
        if (category && category !== 'All') {
            filter.category = category;
        }

        const products = await Product.find(filter)
            .sort({ sortOrder: 1, createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).lean();

        if (!product) {
            return next(new ErrorResponse('Product not found', 404));
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all products (including inactive) for admin
// @route   GET /api/v1/products/admin/all
// @access  Admin
exports.getAdminProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
            .sort({ sortOrder: 1, createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create product
// @route   POST /api/v1/products
// @access  Admin
exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Admin
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return next(new ErrorResponse('Product not found', 404));
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Admin
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return next(new ErrorResponse('Product not found', 404));
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

const express = require('express');

const {
    getProducts,
    getProduct,
    getAdminProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products.controller');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Admin routes (protected) — must be before /:id to avoid 'admin' matching as an ID
router.get('/admin/all', protect, authorize('admin'), getAdminProducts);
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

module.exports = router;

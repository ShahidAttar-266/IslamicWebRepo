const express = require('express');
const { renderBlogPage } = require('../controllers/blogRender.controller');

const router = express.Router();

// @route   GET /api/v1/render/blog/:slug
// @desc    SSR render a blog article page for crawler SEO
// @access  Public
router.get('/blog/:slug', renderBlogPage);

module.exports = router;

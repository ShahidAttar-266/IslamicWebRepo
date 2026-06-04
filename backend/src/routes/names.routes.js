const express = require('express');
const {
    getNames,
    getName,
    getSitemap,
    createName,
    updateName,
    deleteName
} = require('../controllers/names.controller');
const { renderNamePage, renderHomePage } = require('../controllers/render.controller');

const { protect, authorize } = require('../middlewares/auth');
const optionalProtect = require('../middlewares/optionalProtect');

const router = express.Router();

router.get('/sitemap.xml', getSitemap);
router.get('/render/:idOrSlug', renderNamePage);
router.get('/render-home', renderHomePage);

router.route('/')
    .get(optionalProtect, getNames)
    .post(protect, authorize('admin'), createName);

router.route('/:id')
    .get(optionalProtect, getName)
    .put(protect, authorize('admin'), updateName)
    .delete(protect, authorize('admin'), deleteName);

module.exports = router;
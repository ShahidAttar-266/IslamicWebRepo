const express = require('express');
const {
    getNames,
    getName,
    getSitemap,
    createName,
    updateName,
    deleteName
} = require('../controllers/names.controller');

const { protect, authorize } = require('../middlewares/auth');
const optionalProtect = require('../middlewares/optionalProtect');

const router = express.Router();

router.get('/sitemap.xml', getSitemap);

router.route('/')
    .get(optionalProtect, getNames)
    .post(protect, authorize('admin'), createName);

router.route('/:id')
    .get(optionalProtect, getName)
    .put(protect, authorize('admin'), updateName)
    .delete(protect, authorize('admin'), deleteName);

module.exports = router;
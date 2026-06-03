const express = require('express');
const {
    getFavorites,
    addFavorite,
    removeFavorite
} = require('../controllers/users.controller');

const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // All user routes require authentication

router.route('/favorites')
    .get(getFavorites);

router.route('/favorites/:nameId')
    .post(addFavorite)
    .delete(removeFavorite);

module.exports = router;
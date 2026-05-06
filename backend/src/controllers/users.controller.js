const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc    Get user's favorite names
// @route   GET /api/v1/users/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('savedNames');

        // Filter out any null values (in case a name was hard deleted)
        const validFavorites = user.savedNames.filter(name => name != null);

        res.status(200).json({
            success: true,
            data: validFavorites
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Add name to favorites
// @route   POST /api/v1/users/favorites/:nameId
// @access  Private
exports.addFavorite = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $addToSet: { savedNames: req.params.nameId } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: user.savedNames
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Remove name from favorites
// @route   DELETE /api/v1/users/favorites/:nameId
// @access  Private
exports.removeFavorite = async (req, res, next) => {
    if (!req.params.nameId.match(/^[0-9a-fA-F]{24}$/)) {
        return next(new ErrorResponse('Invalid name ID format', 400));
    }
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { savedNames: req.params.nameId } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: user.savedNames
        });
    } catch (err) {
        next(err);
    }
};
const express = require('express');
const {
    createCheckoutSession,
    stripeWebhook,
    getSubscriptionStatus
} = require('../controllers/subscriptions.controller');

const { protect } = require('../middlewares/auth');

const router = express.Router();

// Webhook needs raw body, handled in app.js
router.post('/webhook', stripeWebhook);

// Protected routes
router.use(protect);
router.post('/create-checkout', createCheckoutSession);
router.get('/status', getSubscriptionStatus);

module.exports = router;
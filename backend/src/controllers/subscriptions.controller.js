const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const crypto = require('crypto');

// Lazy initialize Razorpay
const getRazorpay = () => {
    const Razorpay = require('razorpay');
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
};

// @desc    Create Razorpay payment link
// @route   POST /api/v1/subscriptions/create-checkout
// @access  Private
exports.createCheckoutSession = async (req, res, next) => {
    try {
        const { planId, billingCycle } = req.body;
        
        // TEST PRICES: 1 rupee (100 paise) for testing
        const amount = 100; // 1 rupee = 100 paise
        
        const razorpay = getRazorpay();
        
        const paymentLink = await razorpay.paymentLink.create({
            amount: amount,
            currency: "INR",
            accept_partial: false,
            description: `Subscription for ${billingCycle} plan`,
            options: {
                checkout: {
                    method: {
                        netbanking: "1",
                        card: "1",
                        upi: "1",
                        wallet: "1"
                    }
                }
            },
            customer: {
                name: req.user.name,
                email: req.user.email,
                contact: "" // Add contact if available in user model
            },
            notify: {
                sms: false,
                email: true
            },
            reminder_enable: true,
            notes: {
                userId: req.user.id.toString(),
                billingCycle: billingCycle,
                planType: 'premium'
            },
            callback_url: `${process.env.FRONTEND_URL}/success`,
            callback_method: "get"
        });

        res.status(200).json({
            success: true,
            url: paymentLink.short_url
        });
    } catch (err) {
        console.error('Razorpay Error:', err);
        next(new ErrorResponse(`Subscription service error: ${err.message}`, 500));
    }
};

// @desc    Razorpay Webhook
// @route   POST /api/v1/subscriptions/webhook
// @access  Public
exports.razorpayWebhook = async (req, res, next) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('[RAZORPAY_WEBHOOK] RAZORPAY_WEBHOOK_SECRET is not configured');
        return res.status(500).send('Webhook configuration error');
    }

    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(req.body);
    const digest = shasum.digest('hex');
    const signature = req.headers['x-razorpay-signature'];

    if (digest !== signature) {
        console.error('[RAZORPAY_WEBHOOK_ERROR] Invalid Signature');
        return res.status(400).send('Webhook Error: Invalid Signature');
    }

    // Parse the raw body to JSON
    let body;
    try {
        body = JSON.parse(req.body.toString());
    } catch (e) {
        return res.status(400).send('Invalid JSON');
    }

    const event = body.event;
    const payload = body.payload;

    try {
        switch (event) {
            case 'payment_link.paid': {
                const paymentLink = payload.payment_link.entity;
                const userId = paymentLink.notes.userId;
                const billingCycle = paymentLink.notes.billingCycle;
                const planType = paymentLink.notes.planType;
                
                // Calculate end date based on billing cycle
                const startDate = new Date();
                const endDate = new Date();
                if (billingCycle === 'yearly') {
                    endDate.setFullYear(endDate.getFullYear() + 1);
                } else {
                    endDate.setMonth(endDate.getMonth() + 1);
                }
                
                // Create subscription record
                await Subscription.create({
                    userId,
                    razorpaySubscriptionId: paymentLink.id,
                    razorpayPaymentId: payload.payment.entity.id,
                    planType: planType,
                    billingCycle: billingCycle,
                    status: 'active',
                    startDate,
                    endDate
                });

                // Update User
                await User.findByIdAndUpdate(userId, {
                    'subscription.status': planType,
                    'subscription.razorpayPaymentId': payload.payment.entity.id,
                    'subscription.razorpaySubscriptionId': paymentLink.id,
                    'subscription.planType': billingCycle,
                    'subscription.startDate': startDate,
                    'subscription.endDate': endDate
                });
                break;
            }
            case 'payment_link.cancelled':
            case 'payment_link.expired': {
                const paymentLink = payload.payment_link.entity;
                
                // Update subscription record
                await Subscription.findOneAndUpdate(
                    { razorpaySubscriptionId: paymentLink.id },
                    { status: 'cancelled', cancelledAt: new Date() }
                );

                // Update User
                await User.findOneAndUpdate(
                    { 'subscription.razorpaySubscriptionId': paymentLink.id },
                    { 'subscription.status': 'cancelled' }
                );
                break;
            }
            default:
                console.log(`Unhandled event type ${event}`);
        }

        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('Error processing Razorpay webhook:', error);
        res.status(500).send('Error processing webhook');
    }
};

// @desc    Get subscription status
// @route   GET /api/v1/subscriptions/status
// @access  Private
exports.getSubscriptionStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user.subscription
        });
    } catch (err) {
        next(err);
    }
};
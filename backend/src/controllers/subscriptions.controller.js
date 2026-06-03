const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const cache = require('../utils/cache');
const crypto = require('crypto');

// ─── Plan IDs from Razorpay Dashboard ───────────────────────────────────
const PLAN_IDS = {
    premium: {
        monthly: process.env.RAZORPAY_PREMIUM_PLAN || process.env.RAZORPAY_PLAN_MONTHLY,
        yearly:  process.env.RAZORPAY_PREMIUM_PLAN_YEARLY || process.env.RAZORPAY_PLAN_YEARLY
    }
};

// ─── Lazy-initialize Razorpay ─────────────────────────────────────────────────
const getRazorpay = () => {
    const Razorpay = require('razorpay');
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        console.error('[RAZORPAY] Missing KEY_ID or KEY_SECRET in environment');
    }

    return new Razorpay({
        key_id:     keyId,
        key_secret: keySecret
    });
};

// @desc    Create Razorpay subscription for Standard Checkout
// @route   POST /api/v1/subscriptions/create-checkout
// @access  Private
exports.createCheckoutSession = async (req, res, next) => {
    try {
        const { planId, billingCycle = 'monthly' } = req.body;
        console.log(`[RAZORPAY] Creating subscription request: planId=${planId}, user=${req.user.email}`);

        // Validate planId
        if (!PLAN_IDS[planId]) {
            return next(new ErrorResponse(`Invalid planId: ${planId}`, 400));
        }

        // Get the plan ID from environment
        const razorpayPlanId = PLAN_IDS[planId][billingCycle] || PLAN_IDS[planId].monthly;

        if (!razorpayPlanId || razorpayPlanId === 'plan_monthly_id' || razorpayPlanId === 'plan_yearly_id') {
            return next(new ErrorResponse('Payment plan not configured correctly in server environment', 400));
        }

        const razorpay = getRazorpay();

        // Total count: how many times the user will be charged
        // For monthly: 12 (1 year), For yearly: 1
        const totalCount = billingCycle === 'yearly' ? 1 : 12;

        const subscriptionOptions = {
            plan_id: razorpayPlanId,
            total_count: totalCount,
            customer_notify: 1,
            notes: {
                userId:       req.user.id.toString(),
                planType:     planId,
                billingCycle: billingCycle
            }
        };

        const subscription = await razorpay.subscriptions.create(subscriptionOptions);

        // We return the subscription details so the frontend can open the standard checkout popup
        res.status(200).json({
            success: true,
            data: {
                id: subscription.id,
                entity: subscription.entity,
                plan_id: subscription.plan_id,
                status: subscription.status,
                // Add metadata for frontend Razorpay options
                key: process.env.RAZORPAY_KEY_ID,
                amount: subscription.amount, // Note: amount is in paise for subscriptions
                name: "IslamicNames",
                description: `${planId.toUpperCase()} Plan Subscription`,
                prefill: {
                    name: req.user.name,
                    email: req.user.email,
                    contact: req.user.phone || ''
                },
                theme: {
                    color: "#4F46E5" // Indigo-600
                }
            }
        });
    } catch (err) {
        console.error('[RAZORPAY] createCheckoutSession error:', err);
        const statusCode = err.statusCode || 500;
        const message = err.error ? err.error.description : err.message;
        next(new ErrorResponse(`Subscription service error: ${message}`, statusCode));
    }
};

// @desc    Verify Razorpay subscription payment
// @route   POST /api/v1/subscriptions/verify-subscription
// @access  Private
exports.verifySubscription = async (req, res, next) => {
    try {
        const { 
            razorpay_payment_id, 
            razorpay_subscription_id, 
            razorpay_signature,
            planId
        } = req.body;

        console.log(`[RAZORPAY_VERIFY] User ${req.user.email} verifying sub: ${razorpay_subscription_id}`);

        // 1. Verify the signature
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_payment_id + '|' + razorpay_subscription_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            console.error('[RAZORPAY_VERIFY] Invalid signature');
            return next(new ErrorResponse('Payment verification failed: Invalid Signature', 400));
        }

        // 2. Fetch the subscription from Razorpay to get the latest status
        const razorpay = getRazorpay();
        const subData = await razorpay.subscriptions.fetch(razorpay_subscription_id);

        // 3. Update User and Subscription in MongoDB
        const startDate = new Date();
        const endDate = new Date();
        
        // Find billing cycle from notes or default to monthly
        const billingCycle = subData.notes?.billingCycle || 'monthly';
        
        if (billingCycle === 'yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
            endDate.setMonth(endDate.getMonth() + 1);
        }

        // Update/Upsert Subscription record
        await Subscription.findOneAndUpdate(
            { razorpaySubscriptionId: razorpay_subscription_id },
            {
                userId: req.user.id,
                razorpaySubscriptionId: razorpay_subscription_id,
                razorpayPaymentId: razorpay_payment_id,
                planType: planId || subData.notes?.planType || 'premium',
                billingCycle: billingCycle,
                status: 'active',
                startDate,
                endDate
            },
            { upsert: true, new: true }
        );

        // Upgrade the user
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            'subscription.status': planId || subData.notes?.planType || 'premium',
            'subscription.razorpaySubscriptionId': razorpay_subscription_id,
            'subscription.razorpayPaymentId': razorpay_payment_id,
            'subscription.planType': billingCycle,
            'subscription.startDate': startDate,
            'subscription.endDate': endDate
        }, { new: true });

        console.log(`[RAZORPAY_VERIFY] Success: User ${req.user.email} upgraded to ${planId}`);

        // Invalidate cache
        await cache.invalidateMany([
            `user:doc:${req.user.id}`,
            'admin:analytics',
            'admin:subscriptions:list'
        ]);

        res.status(200).json({
            success: true,
            message: 'Payment verified and subscription activated',
            data: updatedUser.subscription
        });

    } catch (err) {
        console.error('[RAZORPAY_VERIFY] Error:', err);
        next(new ErrorResponse(`Verification error: ${err.message}`, 500));
    }
};

// @desc    Razorpay Webhook
// @route   POST /api/v1/subscriptions/webhook
// @access  Public (Razorpay → your server)
exports.razorpayWebhook = async (req, res) => {
    // ── Step 1: verify the secret is configured ──────────────────────────────
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('[RAZORPAY_WEBHOOK] RAZORPAY_WEBHOOK_SECRET not set');
        return res.status(500).send('Webhook configuration error');
    }

    // ── Step 2: verify HMAC signature ────────────────────────────────────────
    const signature = req.headers['x-razorpay-signature'];
    const digest    = crypto
        .createHmac('sha256', webhookSecret)
        .update(req.body)
        .digest('hex');

    if (!signature || digest !== signature) {
        console.error('[RAZORPAY_WEBHOOK] Invalid signature');
        return res.status(400).send('Webhook Error: Invalid Signature');
    }

    // ── Step 3: parse body ────────────────────────────────────────────────────
    let body;
    try {
        body = JSON.parse(req.body.toString());
    } catch (e) {
        return res.status(400).send('Invalid JSON');
    }

    const event   = body.event;
    const payload = body.payload;
    console.log('[RAZORPAY_WEBHOOK] Received event:', event);

    try {
        switch (event) {
            case 'subscription.charged': {
                const subEntity = payload.subscription.entity;
                const paymentEntity = payload.payment.entity;
                const userId = subEntity.notes?.userId;
                const planType = subEntity.notes?.planType || 'premium';
                const billingCycle = subEntity.notes?.billingCycle || 'monthly';

                if (!userId) {
                    console.error('[RAZORPAY_WEBHOOK] No userId in notes');
                    return res.status(200).json({ status: 'ok' });
                }

                const startDate = new Date();
                const endDate = new Date();
                if (billingCycle === 'yearly') {
                    endDate.setFullYear(endDate.getFullYear() + 1);
                } else {
                    endDate.setMonth(endDate.getMonth() + 1);
                }

                // Update or create subscription record
                await Subscription.findOneAndUpdate(
                    { razorpaySubscriptionId: subEntity.id },
                    {
                        userId,
                        razorpaySubscriptionId: subEntity.id,
                        razorpayPaymentId: paymentEntity.id,
                        planType,
                        billingCycle,
                        status: 'active',
                        startDate,
                        endDate
                    },
                    { upsert: true, new: true }
                );

                // Update user status
                await User.findByIdAndUpdate(userId, {
                    'subscription.status': planType,
                    'subscription.razorpaySubscriptionId': subEntity.id,
                    'subscription.razorpayPaymentId': paymentEntity.id,
                    'subscription.planType': billingCycle,
                    'subscription.startDate': startDate,
                    'subscription.endDate': endDate
                });

                console.log(`[RAZORPAY_WEBHOOK] Subscription activated/charged: User ${userId}, Plan ${planType}`);
                
                // Invalidate cache
                await cache.invalidateMany([
                    `user:doc:${userId}`,
                    'admin:analytics',
                    'admin:subscriptions:list'
                ]);
                break;
            }

            case 'payment.failed': {
                const paymentEntity = payload.payment.entity;
                const subId = paymentEntity.subscription_id;
                
                if (subId) {
                    const sub = await Subscription.findOneAndUpdate(
                        { razorpaySubscriptionId: subId },
                        { status: 'past_due' },
                        { new: true }
                    );
                    if (sub) {
                        await cache.invalidateMany([
                            `user:doc:${sub.userId}`,
                            'admin:analytics',
                            'admin:subscriptions:list'
                        ]);
                    }
                    console.log(`[RAZORPAY_WEBHOOK] Payment failed for subscription: ${subId}`);
                }
                break;
            }

            case 'subscription.cancelled': {
                const subEntity = payload.subscription.entity;
                
                const sub = await Subscription.findOneAndUpdate(
                    { razorpaySubscriptionId: subEntity.id },
                    { status: 'cancelled', cancelledAt: new Date() },
                    { new: true }
                );

                await User.findOneAndUpdate(
                    { 'subscription.razorpaySubscriptionId': subEntity.id },
                    { 'subscription.status': 'cancelled' }
                );

                if (sub) {
                    await cache.invalidateMany([
                        `user:doc:${sub.userId}`,
                        'admin:analytics',
                        'admin:subscriptions:list'
                    ]);
                }

                console.log(`[RAZORPAY_WEBHOOK] Subscription cancelled: ${subEntity.id}`);
                break;
            }
        }

        return res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('[RAZORPAY_WEBHOOK] Handler error:', error);
        return res.status(500).send('Error processing webhook');
    }
};

// @desc    Get subscription status
// @route   GET /api/v1/subscriptions/status
// @access  Private
exports.getSubscriptionStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('subscription');
        res.status(200).json({
            success: true,
            data: user.subscription
        });
    } catch (err) {
        next(err);
    }
};
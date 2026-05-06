const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Lazy initialize Stripe to ensure env is loaded
const getStripe = () => require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe checkout session
// @route   POST /api/v1/subscriptions/create-checkout
// @access  Private
exports.createCheckoutSession = async (req, res, next) => {
    try {
        const { planId, billingCycle } = req.body; // Use plan lookup in real implementation
        
        // Hardcoded price IDs for demo purposes. In production, fetch from Plan model
        const priceId = process.env[`STRIPE_PRICE_${billingCycle.toUpperCase()}`]; 
        
        if (!priceId) {
             return next(new ErrorResponse('Invalid plan configuration', 400));
        }

        const stripe = getStripe();
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer_email: req.user.email,
            client_reference_id: req.user.id.toString(),
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`
        });

        res.status(200).json({
            success: true,
            url: session.url
        });
    } catch (err) {
        // If it's a Stripe error, it might have a 401 status if the API key is invalid
        // We don't want to return 401 to the frontend as it triggers logout
        if (err.type && err.type.startsWith('Stripe')) {
            return next(new ErrorResponse(`Subscription service error: ${err.message}`, 500));
        }
        next(err);
    }
};

// @desc    Stripe Webhook
// @route   POST /api/v1/subscriptions/webhook
// @access  Public
exports.stripeWebhook = async (req, res, next) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('[STRIPE_WEBHOOK] STRIPE_WEBHOOK_SECRET is not configured');
        return res.status(500).send('Webhook configuration error');
    }

    const stripe = getStripe();
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // req.body must be raw buffer for stripe signature verification
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error(`[STRIPE_WEBHOOK_ERROR] ${err.message}`);
        return res.status(400).send('Webhook Error: Invalid Signature');
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const userId = session.client_reference_id;
                
                // Retrieve subscription details
                const subscription = await stripe.subscriptions.retrieve(session.subscription);
                
                // Create subscription record
                await Subscription.create({
                    userId,
                    stripeSubscriptionId: subscription.id,
                    stripeCustomerId: subscription.customer,
                    planType: 'premium', // Simplification, extract from line items
                    billingCycle: 'monthly',
                    status: 'active',
                    startDate: new Date(subscription.current_period_start * 1000),
                    endDate: new Date(subscription.current_period_end * 1000)
                });

                // Update User
                await User.findByIdAndUpdate(userId, {
                    'subscription.status': 'premium',
                    'subscription.stripeCustomerId': subscription.customer,
                    'subscription.stripeSubscriptionId': subscription.id,
                    'subscription.planType': 'monthly',
                    'subscription.startDate': new Date(subscription.current_period_start * 1000),
                    'subscription.endDate': new Date(subscription.current_period_end * 1000)
                });
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                
                // Update subscription record
                await Subscription.findOneAndUpdate(
                    { stripeSubscriptionId: subscription.id },
                    { status: 'cancelled', cancelledAt: new Date() }
                );

                // Update User
                await User.findOneAndUpdate(
                    { 'subscription.stripeSubscriptionId': subscription.id },
                    { 'subscription.status': 'cancelled' }
                );
                break;
            }
            // Add other events like invoice.payment_failed as needed
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        res.status(200).send();
    } catch (error) {
        console.error('Error processing webhook:', error);
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
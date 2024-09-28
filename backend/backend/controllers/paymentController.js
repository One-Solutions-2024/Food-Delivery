const { check, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Validate required environment variables
if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Missing required environment variables: STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET');
}

// Define the createPayment function with validation
const createPayment = [
    check('amount').isInt({ gt: 0 }).withMessage('Amount must be a positive integer'),
    check('currency').isString().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code'),
    check('paymentMethodId').isString().withMessage('Payment method ID is required'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { amount, currency, paymentMethodId } = req.body;

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
                payment_method: paymentMethodId,
                confirm: true,
            });

            res.json({
                success: true,
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status,
            });
        } catch (error) {
            console.error('Payment error:', error);
            if (error.type === 'StripeCardError') {
                return res.status(400).json({ error: 'Your card was declined.' });
            }
            res.status(500).json({ error: 'An error occurred during payment processing.' });
        }
    }
];

// Define the createPaymentIntent function
const createPaymentIntent = async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
};



// Define the getPaymentStatus function
const getPaymentStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(id);
        res.json({
            success: true,
            status: paymentIntent.status,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error('Error retrieving payment status:', error);
        res.status(500).json({ error: error.message });
    }
};

// Handle Payment Notifications (webhook)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Store your webhook secret in an environment variable

const handlePaymentNotification = async (req, res) => {
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], endpointSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            console.log('PaymentIntent was successful!', paymentIntentSucceeded);
            // Implement your logic to update order status in your database
            break;

        case 'payment_intent.payment_failed':
            const paymentIntentFailed = event.data.object;
            console.log('PaymentIntent failed:', paymentIntentFailed);
            // Implement your logic to notify the user of the failed payment
            break;

        default:
            console.warn(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send('Webhook received');
};


const processPayment = async (req, res) => {
    const { amount, currency, source } = req.body; // Expecting these fields in the request body

    // Basic validation
    if (!amount || !currency || !source) {
        return res.status(400).json({ error: 'Amount, currency, and source are required' });
    }

    try {
        // Create a new payment
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: source, // This should be the payment method ID obtained from the frontend
            confirmation_method: 'manual', // Change as per your requirement
            confirm: true, // Automatically confirm the payment
        });

        // Respond with success
        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            payment: paymentIntent,
        });
    } catch (error) {
        // Handle errors from Stripe
        if (error.code === 'card_error') {
            return res.status(400).json({ error: error.message });
        }
        console.error('Payment processing error:', error);
        res.status(500).json({ error: 'Payment failed', details: error.message });
    }
};

// Export all the functions
module.exports = {
    createPayment,
    createPaymentIntent,
    processPayment,
    getPaymentStatus,
    handlePaymentNotification
};

const express = require('express');
const router = express.Router();

// Import the payment controller methods
const { 
    createPayment, 
    getPaymentStatus, 
    handlePaymentNotification, 
    createPaymentIntent, 
    processPayment 
} = require('../controllers/paymentController');

// Import the auth and validation middleware
const auth = require('../middleware/auth');  
const { validatePayment } = require('../middleware/validation');

// Route to create a new payment
router.post('/', auth, validatePayment, async (req, res, next) => {
    try {
        const payment = await createPayment(req.body);
        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});

// Route to retrieve payment status by ID
router.get('/:id', auth, async (req, res, next) => {
    try {
        const paymentStatus = await getPaymentStatus(req.params.id);
        if (!paymentStatus) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }
        res.status(200).json({ success: true, data: paymentStatus });
    } catch (error) {
        next(error);
    }
});

// Route to handle payment notifications (webhook)
router.post('/notification', async (req, res, next) => {
    try {
        await handlePaymentNotification(req.body); // Handle the webhook notification
        res.status(200).json({ success: true, message: 'Notification received' });
    } catch (error) {
        next(error);
    }
});

// Route to create a payment intent
router.post('/create-payment-intent', async (req, res, next) => {
    try {
        const paymentIntent = await createPaymentIntent(req.body);
        res.status(200).json({ success: true, data: paymentIntent });
    } catch (error) {
        next(error);
    }
});

// Define POST route for processing payments
router.post('/payment', async (req, res, next) => {
    try {
        const result = await processPayment(req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

// POST route for processing payment
router.post('/process', processPayment);

// Export the router
module.exports = router;

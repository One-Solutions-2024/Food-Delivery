const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const deliveryBoyController = require('../controllers/deliveryBoyController');
const auth = require('../middleware/auth'); // Import the auth middleware
const rateLimit = require('express-rate-limit');
const { validateDeliveryBoy, validateDeliveryBoyUpdate } = require('../middleware/validation'); // Import validation middleware

// Route to register a new delivery boy
router.post('/register', validateDeliveryBoy, deliveryBoyController.registerDeliveryBoy);

// Route to get all delivery boys with optional pagination
router.get('/', deliveryBoyController.getAllDeliveryBoys);

// Route to get a delivery boy by ID
router.get('/:id', deliveryBoyController.getDeliveryBoyById);

// Route to update delivery boy information
router.put('/:id', auth, validateDeliveryBoyUpdate, deliveryBoyController.updateDeliveryBoy);

// Route to notify delivery boys about new orders
router.post('/notify', deliveryBoyController.notifyDeliveryBoys);

// Update order status - only for authenticated delivery boys
router.put('/updateOrderStatus/:id', auth, deliveryBoyController.updateOrderStatus);

// Apply rate limiter to the login route
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: 'Too many login attempts. Please try again after 15 minutes.'
});

// Validation rules applied as middleware in the route
router.post('/login', [
    check('phoneNumber').isMobilePhone().withMessage('Invalid phone number'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], loginLimiter, deliveryBoyController.loginDeliveryBoy);
// Export the router
module.exports = router;

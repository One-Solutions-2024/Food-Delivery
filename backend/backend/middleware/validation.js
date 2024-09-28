const { body, validationResult } = require('express-validator');

// Generic error handler middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation for delivery boy registration
const validateDeliveryBoy = [
    body('name').notEmpty().withMessage('Name is required'),
    body('phoneNumber').isNumeric().isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits long'),
    body('vehicleDetails').notEmpty().withMessage('Vehicle details are required'),
    body('location.coordinates')
        .isArray({ min: 2, max: 2 }).withMessage('Location coordinates are required and must contain two values [longitude, latitude]'),
    handleValidationErrors
];

// Validation for updating delivery boy information
const validateDeliveryBoyUpdate = [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('phoneNumber').optional().isNumeric().isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits long'),
    body('vehicleDetails').optional().notEmpty().withMessage('Vehicle details cannot be empty'),
    body('location.coordinates')
        .optional()
        .isArray({ min: 2, max: 2 }).withMessage('Coordinates must have two values [longitude, latitude]'),
    handleValidationErrors
];

const validateOrder = [
    body('customer').notEmpty().withMessage('Customer ID is required'),
    body('restaurant').notEmpty().withMessage('Restaurant ID is required'),
    body('items').isArray().withMessage('Items must be an array').notEmpty().withMessage('Items cannot be empty'),
    body('items.*.item').notEmpty().withMessage('Item ID is required for each item'),
    body('items.*.quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
    body('totalAmount').isFloat({ gt: 0 }).withMessage('Total amount must be a positive number'),
    body('deliveryAddress').notEmpty().withMessage('Delivery address is required'),
    handleValidationErrors
];

const validatePayment = [
    body('order').notEmpty().withMessage('Order ID is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
    body('method').isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash']).withMessage('Invalid payment method'),
    body('transactionId').notEmpty().isString().isLength({ min: 1 }).withMessage('Transaction ID is required and must be a string'),
    handleValidationErrors
];

// Validation for registering a restaurant
const validateRestaurant = [
    body('name').notEmpty().withMessage('Restaurant name is required'),
    body('address.street').notEmpty().withMessage('Street address is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.state').notEmpty().withMessage('State is required'),
    body('address.zipCode').notEmpty().withMessage('Zip code is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('description').notEmpty().withMessage('Description is required'),
    handleValidationErrors
];

// Validation for adding/updating a menu item
const validateMenuItem = [
    body('name').notEmpty().withMessage('Menu item name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    handleValidationErrors
];

module.exports = { 
    validateDeliveryBoy, 
    validateDeliveryBoyUpdate, 
    validateOrder, 
    validatePayment, 
    validateRestaurant, 
    validateMenuItem 
};

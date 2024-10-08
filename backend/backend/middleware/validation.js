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

// Validation for order creation
const validateOrder = [
    body('customer').notEmpty().withMessage('Customer ID is required'),
    body('restaurant').notEmpty().withMessage('Restaurant ID is required'),
    body('items').isArray().withMessage('Items must be an array').notEmpty().withMessage('Items cannot be empty'),
    body('items.*.item').notEmpty().withMessage('Item ID is required for each item'),
    body('items.*.quantity').isInt({ gt: 0 }).withMessage('Quantity must be greater than 0'),
    body('deliveryAddress').notEmpty().withMessage('Delivery address is required'),
    handleValidationErrors
];

module.exports = { 
    validateDeliveryBoy, 
    validateDeliveryBoyUpdate, 
    validateOrder 
};

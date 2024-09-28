const { check, validationResult } = require('express-validator');
const Restaurant = require('../models/Restaurant');
const Menu = require('../models/Menu');

// Register a new restaurant
exports.registerRestaurant = [
    // Validation rules
    check('name').notEmpty().withMessage('Name is required.'),
    check('address').notEmpty().withMessage('Address is required.'),
    check('contactNumber').notEmpty().withMessage('Contact number is required.'),

    // Async handler function
    async (req, res) => {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, address, contactNumber } = req.body;

        try {
            // Create new restaurant and save
            const newRestaurant = new Restaurant({ name, address, contactNumber });
            await newRestaurant.save();

            // Respond with success message
            res.status(201).json({ message: 'Restaurant registered successfully', restaurant: newRestaurant });
        } catch (error) {
            console.error('Error registering restaurant:', error);
            res.status(500).json({ message: 'Error registering restaurant', error: error.message });
        }
    }
];

// Get a list of all restaurants
exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error retrieving restaurants:', error);
        res.status(500).json({ message: 'Error retrieving restaurants', error: error.message });
    }
};

// Get details of a specific restaurant by ID
exports.getRestaurantById = async (req, res) => {
    const { id } = req.params;

    try {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.status(200).json(restaurant);
    } catch (error) {
        console.error('Error retrieving restaurant:', error);
        res.status(500).json({ message: 'Error retrieving restaurant', error: error.message });
    }
};

// Update restaurant details
exports.updateRestaurant = [
    check('name').optional().notEmpty().withMessage('Name cannot be empty.'),
    check('address').optional().notEmpty().withMessage('Address cannot be empty.'),
    check('contactNumber').optional().notEmpty().withMessage('Contact number cannot be empty.'),

    async (req, res) => {
        const { id } = req.params;
        const { name, address, contactNumber } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedRestaurant = await Restaurant.findByIdAndUpdate(
                id,
                { name, address, contactNumber },
                { new: true, runValidators: true } // Validate updates
            );
            if (!updatedRestaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }
            res.status(200).json({ message: 'Restaurant updated successfully', restaurant: updatedRestaurant });
        } catch (error) {
            console.error('Error updating restaurant:', error);
            res.status(500).json({ message: 'Error updating restaurant', error: error.message });
        }
    }
];

// Delete a restaurant
exports.deleteRestaurant = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
        if (!deletedRestaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.status(204).json(); // No content
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        res.status(500).json({ message: 'Error deleting restaurant', error: error.message });
    }
};

// Manage Menu for a Restaurant
exports.addMenuItem = [
    check('restaurantId').notEmpty().withMessage('Restaurant ID is required.'),
    check('itemName').notEmpty().withMessage('Item name is required.'),
    check('price').isNumeric().withMessage('Price must be a number.'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { restaurantId, itemName, price } = req.body;

        try {
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            const menuItem = new Menu({ restaurantId, itemName, price });
            await menuItem.save();
            res.status(201).json({ message: 'Menu item added successfully', menuItem });
        } catch (error) {
            console.error('Error adding menu item:', error);
            res.status(500).json({ message: 'Error adding menu item', error: error.message });
        }
    }
];

// Get menu items for a specific restaurant
exports.getMenuItems = async (req, res) => {
    const { restaurantId } = req.params;

    try {
        const menuItems = await Menu.find({ restaurantId });
        res.status(200).json(menuItems);
    } catch (error) {
        console.error('Error retrieving menu items:', error);
        res.status(500).json({ message: 'Error retrieving menu items', error: error.message });
    }
};

// Exporting all functions
module.exports = {
    registerRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    addMenuItem,
    getMenuItems
};

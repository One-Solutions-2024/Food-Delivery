const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const auth = require('../middleware/auth'); // Import your authentication middleware
const { validateRestaurant, validateMenuItem } = require('../middleware/validation'); // Import validation middleware

// Route to register a new restaurant
router.post('/register', auth, validateRestaurant, async (req, res, next) => {
    try {
        const restaurant = await restaurantController.registerRestaurant(req.body);
        res.status(201).json({ success: true, data: restaurant });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});

// Route to update restaurant details
router.put('/:id', auth, validateRestaurant, async (req, res, next) => {
    try {
        const updatedRestaurant = await restaurantController.updateRestaurant(req.params.id, req.body);
        if (!updatedRestaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }
        res.status(200).json({ success: true, data: updatedRestaurant });
    } catch (error) {
        next(error);
    }
});

// Route to get restaurant details by ID
router.get('/:id', async (req, res, next) => {
    try {
        const restaurant = await restaurantController.getRestaurantById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        next(error);
    }
});

// Route to get all restaurants
router.get('/', async (req, res, next) => {
    try {
        const restaurants = await restaurantController.getAllRestaurants();
        res.status(200).json({ success: true, data: restaurants });
    } catch (error) {
        next(error);
    }
});

// Route to add a menu item to a restaurant
router.post('/:id/menu', auth, validateMenuItem, async (req, res, next) => {
    try {
        const menuItem = await restaurantController.addMenuItem(req.params.id, req.body);
        res.status(201).json({ success: true, data: menuItem });
    } catch (error) {
        next(error);
    }
});

// Route to get all menu items for a restaurant
router.get('/:id/menu', async (req, res, next) => {
    try {
        const menuItems = await restaurantController.getMenuItems(req.params.id);
        res.status(200).json({ success: true, data: menuItems });
    } catch (error) {
        next(error);
    }
});

// Route to update a menu item for a restaurant
router.put('/:restaurantId/menu/:menuItemId', auth, validateMenuItem, async (req, res, next) => {
    try {
        const updatedMenuItem = await restaurantController.updateMenuItem(req.params.restaurantId, req.params.menuItemId, req.body);
        if (!updatedMenuItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }
        res.status(200).json({ success: true, data: updatedMenuItem });
    } catch (error) {
        next(error);
    }
});

// Route to delete a menu item for a restaurant
router.delete('/:restaurantId/menu/:menuItemId', auth, async (req, res, next) => {
    try {
        const deletedMenuItem = await restaurantController.deleteMenuItem(req.params.restaurantId, req.params.menuItemId);
        if (!deletedMenuItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        next(error);
    }
});

// Export the router
module.exports = router;

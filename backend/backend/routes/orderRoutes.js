// orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth'); // Import the auth middleware
const { validateOrder } = require('../middleware/validation'); // Import validation middleware

// Route to get all orders (optional pagination and filtering can be added)
router.get('/', async (req, res, next) => {
    try {
        const orders = await orderController.getAllOrders();
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
});

// Route to place a new order - protected by authentication
router.post('/', auth, validateOrder, async (req, res, next) => {
    try {
        const newOrder = await orderController.placeOrder(req.body);
        res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
        next(error);
    }
});

// Route to get order details by ID
router.get('/:id', async (req, res, next) => {
    try {
        const order = await orderController.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
});

// Route to update order status by ID - protected by authentication
router.put('/:id/status', auth, async (req, res, next) => {
    try {
        const updatedOrder = await orderController.updateOrderStatus(req.params.id, req.body.status);
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        next(error);
    }
});

// Route to get orders by a specific delivery boy
router.get('/delivery-boy/:deliveryBoyId', async (req, res, next) => {
    try {
        const orders = await orderController.getOrdersByDeliveryBoy(req.params.deliveryBoyId);
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
});

// Export the router
module.exports = router;

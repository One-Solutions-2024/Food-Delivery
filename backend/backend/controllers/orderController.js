// orderController.js

const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const DeliveryBoy = require('../models/DeliveryBoy');
const notification = require('../utils/notification'); // Ensure this file exists
const io = require('../server').io; // Import the Socket.IO instance
const { check, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Rate limiter for placing orders
const orderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many orders created from this IP, please try again later.'
});

// Function to place a new order with rate limiting
const placeOrder = [
    orderLimiter, // Apply the rate limit
    check('userId').isMongoId().withMessage('User ID must be a valid MongoDB ID'),
    check('restaurantId').isMongoId().withMessage('Restaurant ID must be a valid MongoDB ID'),
    check('items').isArray().notEmpty().withMessage('Items must be a non-empty array'),
    check('deliveryBoyId').optional().isMongoId().withMessage('Delivery Boy ID must be a valid MongoDB ID'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, restaurantId, items, deliveryBoyId, deviceToken } = req.body;

        try {
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            const newOrder = new Order({
                userId,
                restaurantId,
                items,
                status: 'Pending',
                deliveryBoyId
            });

            await newOrder.save();

            if (deliveryBoyId) {
                await DeliveryBoy.findByIdAndUpdate(deliveryBoyId, { $push: { orders: newOrder._id } });
                io.emit('newOrder', newOrder);
            }

            if (deviceToken) {
                await notification.sendNotification(
                    deviceToken,
                    'Order Placed Successfully!',
                    `Your order #${newOrder._id} has been placed and is being prepared.`
                );
            }

            res.status(201).json({ message: 'Order placed successfully', order: newOrder });
        } catch (error) {
            console.error('Error placing order:', error);
            res.status(500).json({ message: 'Error placing order', error: 'Internal Server Error' });
        }
    }
];

// Get order details by ID
const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id).populate('restaurantId').populate('deliveryBoyId');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error retrieving order:', error);
        res.status(500).json({ message: 'Error retrieving order', error: error.message });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Notify all parties (customer & delivery boy) about the status change
        io.emit('orderStatusUpdated', updatedOrder); // Push real-time status update via WebSocket

        res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

// Get all orders for a specific user
const getUserOrders = async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.find({ userId }).populate('restaurantId').populate('deliveryBoyId');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error retrieving user orders:', error);
        res.status(500).json({ message: 'Error retrieving user orders', error: error.message });
    }
};

// Notify delivery boys about new orders (simplified example)
const notifyDeliveryBoys = async () => {
    try {
        const orders = await Order.find({ status: 'Pending' }).populate('deliveryBoyId');
        orders.forEach(order => {
            console.log(`Notify delivery boy ${order.deliveryBoyId} for order ${order._id}`);
        });
    } catch (error) {
        console.error('Error notifying delivery boys', error);
    }
};

// Submit user feedback on an order
const submitFeedback = async (req, res) => {
    const { orderId, feedback } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Logic to save feedback (you may want to create a Feedback model)
        order.feedback = feedback; // Assuming you have a feedback field in your Order model
        await order.save();

        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
};

// Exporting all functions
module.exports = {
    placeOrder,
    getOrderById,
    updateOrderStatus,
    getUserOrders,
    notifyDeliveryBoys,
    submitFeedback
};

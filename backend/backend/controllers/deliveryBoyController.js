// backend/controllers/deliveryBoyController.js

const DeliveryBoy = require('../models/DeliveryBoy');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// Register a new delivery boy
exports.registerDeliveryBoy = [
    // Validation rules
    check('name').isLength({ min: 2 }).trim().escape(),
    check('phoneNumber').isMobilePhone().withMessage('Invalid phone number'),
    check('vehicleDetails').notEmpty().withMessage('Vehicle details are required'),
    check('location').notEmpty().withMessage('Location is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, phoneNumber, vehicleDetails, location, password } = req.body;

        try {
            // Check if the delivery boy already exists
            const existingDeliveryBoy = await DeliveryBoy.findOne({ phoneNumber });
            if (existingDeliveryBoy) {
                return res.status(400).json({ message: 'Delivery boy already exists' });
            }

            // Hash the password before saving to the database
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a new delivery boy record
            const newDeliveryBoy = new DeliveryBoy({
                name,
                phoneNumber,
                vehicleDetails,
                location,
                password: hashedPassword
            });

            // Save the new delivery boy to the database
            await newDeliveryBoy.save();

            // Respond with a success message and the newly created delivery boy
            res.status(201).json({
                message: 'Delivery boy registered successfully',
                deliveryBoy: {
                    id: newDeliveryBoy._id,
                    name: newDeliveryBoy.name,
                    phoneNumber: newDeliveryBoy.phoneNumber,
                    vehicleDetails: newDeliveryBoy.vehicleDetails,
                    location: newDeliveryBoy.location
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error registering delivery boy', error });
        }
    }
];

// Get all delivery boys
exports.getAllDeliveryBoys = async (req, res) => {
    try {
        const deliveryBoys = await DeliveryBoy.find();
        res.status(200).json(deliveryBoys);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching delivery boys', error });
    }
};

// Get notifications for new orders
exports.getOrderNotifications = async (req, res) => {
    try {
        const deliveryBoyId = req.params.id;

        // Fetch pending orders for the delivery boy
        const orders = await Order.find({ deliveryBoy: deliveryBoyId, status: 'pending' })
            .populate('restaurant')
            .populate('customer');

        if (!orders.length) {
            return res.status(404).json({ message: 'No pending orders for this delivery boy' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order notifications', error });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['picked up', 'on the way', 'delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
            .populate('restaurant')
            .populate('customer');

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order status updated successfully', updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};

// Get delivery boy details by ID
exports.getDeliveryBoyById = async (req, res) => {
    try {
        const deliveryBoyId = req.params.id;
        const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);

        if (!deliveryBoy) {
            return res.status(404).json({ message: 'Delivery boy not found' });
        }

        res.status(200).json(deliveryBoy);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching delivery boy details', error });
    }
};

// Login delivery boy
exports.loginDeliveryBoy = [
    // Validation rules
    check('phoneNumber').isMobilePhone().withMessage('Invalid phone number'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { phoneNumber, password } = req.body;

        try {
            const deliveryBoy = await DeliveryBoy.findOne({ phoneNumber });
            if (!deliveryBoy) {
                return res.status(404).json({ message: 'Delivery boy not found' });
            }

            const isMatch = await bcrypt.compare(password, deliveryBoy.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: deliveryBoy._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({ token, deliveryBoy: { id: deliveryBoy._id, name: deliveryBoy.name } });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error });
        }
    }
];

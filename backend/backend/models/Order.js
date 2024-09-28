const mongoose = require('mongoose');

// Define the Delivery Address Schema
const deliveryAddressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    zipCode: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    }
});

// Define the Order schema
const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    deliveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryBoy',
        default: null // Optional, for tracking delivery
    },
    items: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MenuItem',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0 // Ensures the total amount cannot be negative
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        default: null // Store payment transaction ID if needed
    },
    status: {
        type: String,
        enum: ['pending', 'prepared', 'picked up', 'on the way', 'delivered', 'canceled'],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    estimatedDeliveryTime: {
        type: Date, // To track estimated delivery time
        default: null
    },
    deliveryAddress: deliveryAddressSchema // Use the new delivery address schema
}, { timestamps: true }); // Enable timestamps for createdAt and updatedAt

// Create indexes for performance optimization
orderSchema.index({ customer: 1 });
orderSchema.index({ restaurant: 1 });

// Create the Order model
module.exports = mongoose.model('Order', orderSchema);

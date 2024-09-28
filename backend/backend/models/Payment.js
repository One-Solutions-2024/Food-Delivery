const mongoose = require('mongoose');

// Define the Payment schema
const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0 // Ensure amount is non-negative
    },
    method: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Reference to the Customer model
        required: true
    },
    deliveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryBoy', // Reference to the DeliveryBoy model
        default: null
    },
    isRefunded: {
        type: Boolean,
        default: false // Indicates if the payment has been refunded
    },
    refundDetails: {
        type: String,
        default: null // Store refund details if applicable
    },
    currency: {
        type: String,
        required: true,
        default: 'USD' // Default currency
    },
    refundAmount: {
        type: Number,
        min: 0, // Ensure refund amount is non-negative
        default: 0 // Default to zero unless a refund occurs
    },
    refundDate: {
        type: Date,
        default: null // Store refund date if applicable
    }
});

// Create indexes for performance optimization
paymentSchema.index({ order: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ customer: 1 });
paymentSchema.index({ deliveryBoy: 1 });

// Create the Payment model
module.exports = mongoose.model('Payment', paymentSchema);

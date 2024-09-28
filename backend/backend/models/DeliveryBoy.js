const mongoose = require('mongoose');

// Delivery Boy Schema
const deliveryBoySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // Automatically trim whitespace
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v); // Regex for 10-digit phone numbers
            },
            message: props => `${props.value} is not a valid phone number! Must be 10 digits.`
        }
    },
    vehicleDetails: {
        type: {
            type: String,
            required: true,
            enum: ['car', 'bike', 'scooter'], // Add more specific types if needed
            trim: true // Automatically trim whitespace
        },
        model: {
            type: String,
            required: true,
            trim: true // Automatically trim whitespace
        },
        licensePlate: {
            type: String,
            required: true,
            trim: true // Automatically trim whitespace
        }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            validate: {
                validator: function(v) {
                    return v.length === 2 && 
                           v[0] >= -180 && v[0] <= 180 && // Longitude
                           v[1] >= -90 && v[1] <= 90;    // Latitude
                },
                message: props => `${props.value} is not a valid coordinates array! Must be [longitude, latitude].`
            }
        }
    },
    status: {
        type: String,
        enum: ['available', 'busy', 'offline'],
        default: 'available' // Default status
    }
}, { timestamps: true }); // Enable timestamps for createdAt and updatedAt

// Create a 2dsphere index for geolocation queries
deliveryBoySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('DeliveryBoy', deliveryBoySchema);

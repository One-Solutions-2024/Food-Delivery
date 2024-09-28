const mongoose = require('mongoose');

// Define a regex pattern for validating phone numbers
const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 standard

// Define a validation function for opening hours
const validateOpeningHours = (hours) => {
    const regex = /^(Mo|Tu|We|Th|Fr|Sa|Su)\s\d{1,2}:\d{2}-\d{1,2}:\d{2}(;\s(Mo|Tu|We|Th|Fr|Sa|Su)\s\d{1,2}:\d{2}-\d{1,2}:\d{2})*$/;
    return regex.test(hours);
};

// Define the Restaurant schema
const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    phone: {
        type: String,
        required: true,
        match: phoneRegex, // Validates phone number against the regex pattern
        unique: true // Ensure phone numbers are unique as well
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Improved regex for email validation
    },
    description: { type: String, required: true },
    menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }], // References to MenuItem model
    rating: {
        type: Number,
        default: 0,
        min: 0, // Minimum rating
        max: 5  // Maximum rating
    },
    image: { type: String }, // URL to restaurant image
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    openingHours: {
        type: String,
        validate: {
            validator: validateOpeningHours,
            message: 'Opening hours format is invalid.'
        }
    }, // Optional field for opening hours
    website: { 
        type: String,
        match: /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/ // Validate URL format more flexibly
    }, // Optional field for restaurant website
    cuisines: [{
        type: String,
        enum: ['Italian', 'Chinese', 'Mexican', 'Indian', 'American', 'Japanese', 'Mediterranean'],
        default: 'Italian' // Default to a common cuisine
    }], // Optional field for multiple cuisine types
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    socialMediaLinks: {
        type: Map,
        of: String // Allows any number of key-value pairs where the key is the platform name and the value is the URL
    }
});

// Middleware to update `updatedAt` on every save
restaurantSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create indexes for performance optimization
restaurantSchema.index({ name: 1 });
restaurantSchema.index({ 'address.city': 1 });
restaurantSchema.index({ location: '2dsphere' }); // For geolocation queries

// Create the Restaurant model
module.exports = mongoose.model('Restaurant', restaurantSchema);

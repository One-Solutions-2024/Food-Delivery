// backend/config/keys.js

const dotenv = require('dotenv');

// Load environment variables from a .env file into process.env
dotenv.config();

// Export configuration keys
const keys = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/your_database_name',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    paymentGatewayKey: process.env.PAYMENT_GATEWAY_KEY || 'your_payment_gateway_key',
    // Add other keys as needed
};

// Example usage - log the keys after they are loaded
if (!process.env.MONGO_URI) {
    console.warn('Using default mongoURI. Consider setting the MONGO_URI environment variable in your .env file.');
}
console.log('Mongo URI:', keys.mongoURI);

module.exports = keys;

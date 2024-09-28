// /config/stripe.js

// Load environment variables from a .env file into process.env if not already done
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY is not set. Please check your environment variables.');
}

module.exports = {
  secretKey: process.env.STRIPE_SECRET_KEY || 'your_default_stripe_secret_key', // Provide a sensible default for development
};

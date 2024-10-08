// backend/server.js

require('dotenv').config(); // Load environment variables
const express = require('express');
const { errorHandler } = require('./middleware/errorHandler'); // Adjust the path as necessary
const exampleRoutes = require('./routes/exampleRoutes'); // Import your example route
const mongoose = require('mongoose');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const deliveryBoyRoutes = require('./routes/deliveryBoyRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const http = require('http').createServer(app);
const socketIo = require('socket.io');
const logger = require('./utils/logger'); // Import your logger utility
const app = express();
const server = http.createServer(app);
const setupSocket = require('./utils/socket'); // Socket setup file

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // JSON parsing


// Socket.IO connection handling
io.on('connection', (socket) => {
    logger.info('A delivery boy connected:', socket.id);
    socket.on('disconnect', () => {
        logger.info('Delivery boy disconnected');
    });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info('MongoDB connected'))
    .catch(err => logger.error('MongoDB connection error:', err));

// Sample route
app.get('/', (req, res) => {
    res.send('Food Delivery API');
});

// Routes for external APIs
app.use('/api', exampleRoutes); // Mount the router on the /api path
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/delivery-boys', deliveryBoyRoutes);
app.use('/api/restaurants', restaurantRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server

// Setting up middlewares, routes, etc.
const io = setupSocket(http);  // Avoid circular dependency

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setupSocket(server);
// Export the Socket.IO instance
module.exports.io = io;

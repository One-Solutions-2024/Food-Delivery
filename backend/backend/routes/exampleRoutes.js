// backend/routes/exampleRoutes.js

const express = require('express');
const { AppError } = require('../middleware/errorHandler'); // Adjust the path if necessary

const router = express.Router();

// Mock async operation for demonstration
const someAsyncOperation = async () => {
    // Simulate a database call or another async operation
    return null; // or return some data
};

// Define the example route
router.get('/example', async (req, res, next) => {
    try {
        const result = await someAsyncOperation();

        if (!result) {
            return next(new AppError('Resource not found', 404));
        }

        res.status(200).json(result);
    } catch (error) {
        next(new AppError('Failed to process request', 500));
    }
});

module.exports = router;

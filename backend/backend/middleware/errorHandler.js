// backend/middleware/errorHandler.js

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Middleware for handling errors
const errorHandler = (err, req, res, next) => {
    // Default to Internal Server Error if no status code is provided
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Use existing status or default to 500
    const errorMessage = err.message || 'Internal Server Error';

    // Log error for debugging purposes
    console.error(err); // Consider using a logging library for better logging

    res.status(statusCode).json({
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? {
            stack: err.stack, // Optional: include stack trace in development
            statusCode: statusCode,
            // Add any other custom properties from your error object
        } : {},
    });
};

// Export the error handler
module.exports = {
    errorHandler,
    AppError,
};

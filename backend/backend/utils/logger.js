// backend/utils/logger.js

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const environment = process.env.NODE_ENV || 'development';

// Create a logger instance
const logger = winston.createLogger({
    level: environment === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
});

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
});

// Export the logger
module.exports = logger;

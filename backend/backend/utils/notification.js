// backend/utils/notification.js

const admin = require('firebase-admin');
const logger = require('../utils/logger'); // Import a logger utility

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL // Use an environment variable
});

/**
 * Sends a notification to a specific device or topic.
 * 
 * @param {string} target - The device token or topic to send the notification to.
 * @param {string} title - The title of the notification.
 * @param {string} body - The body content of the notification.
 * @param {boolean} isTopic - Whether the target is a topic (default: false).
 */
const sendNotification = async (target, title, body, isTopic = false) => {
    if (!target || typeof target !== 'string') {
        logger.error('Notification token or topic is required and must be a string.');
        throw new Error('Invalid notification target');
    }

    const message = isTopic 
        ? { notification: { title, body }, topic: target } 
        : { notification: { title, body }, token: target };

    try {
        const response = await admin.messaging().send(message);
        logger.info('Notification sent successfully:', response);
    } catch (error) {
        logger.error('Error sending notification:', error);
    }
};

/**
 * Sends order notification to the delivery boy.
 * 
 * @param {string} deliveryBoyToken - The delivery boy's device token.
 * @param {string} orderId - The order ID to include in the notification.
 */
const sendOrderNotification = async (deliveryBoyToken, orderId) => {
    const title = 'New Order Assigned';
    const body = `You have a new order to deliver. Order ID: ${orderId}`;
    await sendNotification(deliveryBoyToken, title, body);
};

/**
 * Sends order status update notification to the customer.
 * 
 * @param {string} customerToken - The customer's device token.
 * @param {string} orderId - The order ID to include in the notification.
 * @param {string} status - The updated status of the order.
 */
const sendOrderStatusUpdateNotification = async (customerToken, orderId, status) => {
    const title = 'Order Status Update';
    const body = `Your order (ID: ${orderId}) is now: ${status}`;
    await sendNotification(customerToken, title, body);
};

/**
 * Test the notification functionality.
 * 
 * @param {string} token - The device token to test.
 */
const testNotification = async (token) => {
    const title = 'Test Notification';
    const body = 'This is a test notification.';
    await sendNotification(token, title, body);
};

module.exports = {
    sendNotification,
    sendOrderNotification,
    sendOrderStatusUpdateNotification,
    testNotification, // Export test function
};

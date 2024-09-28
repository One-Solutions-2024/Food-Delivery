const jwt = require('jsonwebtoken');

// Middleware to protect routes
const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Check if the Authorization header is present and properly formatted
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token using the secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourDefaultSecretKey');
        
        // Attach the decoded token (e.g., delivery boy's ID) to the request object
        req.deliveryBoy = decoded.id;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        let message = 'Token is not valid';
        if (err.name === 'TokenExpiredError') {
            message = 'Token has expired';
        } else if (err.name === 'JsonWebTokenError') {
            message = 'Token is malformed';
        }
        res.status(401).json({ message });
    }
};

module.exports = auth;

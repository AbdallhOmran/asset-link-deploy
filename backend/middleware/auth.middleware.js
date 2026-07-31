const jwt = require('jsonwebtoken');
const Company = require('../models/company.model');
const Inspector = require('../models/inspector.model');

const authMiddleware = async (req, res, next) => {
    try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check user in DB to ensure they still exist and are active
    let user;
    if (decoded.role === 'Inspector') {
        user = await Inspector.findById(decoded.id);
    } else {
        user = await Company.findById(decoded.id);
    }

    if (!user) {
        console.warn("Auth failed: User not found in DB for id", decoded.id);
        return res.status(401).json({ message: 'Not authorized, user no longer exists' });
    }

    if (user.status === 'Deleted') {
        return res.status(401).json({ message: 'Not authorized, account deleted' });
    }

    if (user.status === 'Disabled' && req.method !== 'GET') {
        return res.status(403).json({ message: 'Not authorized, account disabled. You cannot perform this action.' });
    }

    req.user = decoded;

    next();
    } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = authMiddleware;
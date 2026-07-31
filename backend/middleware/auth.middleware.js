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
        return res.status(401).json({ message: 'Not authorized, user no longer exists' });
    }

    if (user.status === 'Deleted') {
        return res.status(401).json({ message: 'Not authorized, account deleted' });
    }

    if (user.status === 'Disabled') {
        return res.status(403).json({ message: 'Not authorized, account disabled' });
    }

    req.user = decoded;

    next();
    } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = authMiddleware;
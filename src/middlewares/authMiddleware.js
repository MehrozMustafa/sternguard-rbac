const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        const user = await User.findById(decoded.id).populate('roles');
        if (!user) return res.status(401).json({ message: 'User not found' });

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token invalid' });
    }
};

module.exports = authMiddleware;

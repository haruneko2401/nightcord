const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Chưa đăng nhập',
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ',
        });
    }
}

module.exports = verifyToken;

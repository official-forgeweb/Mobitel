const jwt = require('jsonwebtoken');

const SECRET = () => process.env.JWT_SECRET || 'secret';

// Generic JWT verification
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET());
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
};

// Admin-only middleware
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ success: false, error: 'Admin access required' });
};

// Worker-only middleware
const requireWorker = (req, res, next) => {
    if (req.user && req.user.role === 'worker') {
        return next();
    }
    return res.status(403).json({ success: false, error: 'Worker access required' });
};

// Admin or Worker middleware
const requireAdminOrWorker = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'worker')) {
        return next();
    }
    return res.status(403).json({ success: false, error: 'Authorized access required' });
};

module.exports = { verifyToken, requireAdmin, requireWorker, requireAdminOrWorker };

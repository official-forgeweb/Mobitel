const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock stats for the admin dashboard
router.get('/stats', (req, res) => {
    res.json({
        totalUsers: 1234,
        revenue: '₹45,678',
        activeRepairs: 56,
        recentActivity: [
            { id: 1, action: 'Device repair completed (Order #1234)', user: 'Alice Smith', status: 'Completed', time: '5 hours ago', type: 'success' },
            { id: 2, action: 'New user sign up', user: 'John Doe', status: 'Info', time: '2 hours ago', type: 'info' }
        ]
    });
});

// Admin login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Compare with credentials stored in .env
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        return res.json({ success: true, token });
    }

    return res.status(401).json({ success: false, error: 'Invalid credentials' });
});

// Admin verify token
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false });

    try {
        jwt.verify(token, process.env.JWT_SECRET || 'secret');
        res.json({ success: true });
    } catch (error) {
        res.status(401).json({ success: false });
    }
});

module.exports = router;

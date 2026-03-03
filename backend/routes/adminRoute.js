const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');

// Dashboard stats — now with real data
router.get('/stats', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalBookings, activeRepairs, completedToday, recentBookings, workerCount] = await Promise.all([
            Booking.countDocuments(),
            Booking.countDocuments({ status: { $in: ['Received', 'Diagnosing', 'Waiting for Parts', 'In Progress', 'Testing'] } }),
            Booking.countDocuments({ status: 'Completed', updatedAt: { $gte: today } }),
            Booking.find().sort({ createdAt: -1 }).limit(5).populate('assignedWorker', 'name'),
            Worker.countDocuments({ status: 'active' })
        ]);

            const recentActivity = recentBookings.map((b, i) => ({
                id: i + 1,
                trackingToken: b.trackingToken,
                action: `${b.serviceType} - ${b.brand} ${b.model}`,
                user: b.customerName,
                status: b.status,
            time: getTimeAgo(b.createdAt),
            type: b.status === 'Completed' ? 'success' : b.status === 'Cancelled' ? 'error' : 'info'
        }));

        res.json({
            totalUsers: totalBookings,
            revenue: `${completedToday} completed today`,
            activeRepairs,
            workerCount,
            recentActivity
        });
    } catch (err) {
        console.error('Error fetching admin stats:', err);
        res.json({
            totalUsers: 0,
            revenue: '₹0',
            activeRepairs: 0,
            recentActivity: []
        });
    }
});

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
}

// Admin login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ role: 'admin', name: 'Admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
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

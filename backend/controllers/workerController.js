const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const BookingUpdate = require('../models/BookingUpdate');
const { notifyStatusChange, notifyJobCompleted, notifyReadyForPickup } = require('../services/notificationService');

const SECRET = () => process.env.JWT_SECRET || 'secret';

// ─── Worker login ───
const workerLogin = async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) {
            return res.status(400).json({ error: 'Phone and password are required' });
        }

        const worker = await Worker.findOne({ phone });
        if (!worker) return res.status(401).json({ error: 'Invalid credentials' });
        if (worker.status !== 'active') return res.status(403).json({ error: 'Account is inactive' });

        const isMatch = await bcrypt.compare(password, worker.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: worker._id, role: 'worker', name: worker.name, phone: worker.phone },
            SECRET(),
            { expiresIn: '7d' }
        );

        res.json({ success: true, token, worker: { id: worker._id, name: worker.name, phone: worker.phone, specialization: worker.specialization } });
    } catch (err) {
        console.error('Worker login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
};

// ─── Get all workers (ADMIN) ───
const getWorkers = async (req, res) => {
    try {
        const workers = await Worker.find().select('-password').sort({ createdAt: -1 });
        res.json(workers);
    } catch (err) {
        console.error('Error fetching workers:', err);
        res.status(500).json({ error: 'Failed to fetch workers' });
    }
};

// ─── Create worker (ADMIN) ───
const createWorker = async (req, res) => {
    try {
        const { name, phone, email, password, specialization, photo } = req.body;
        if (!name || !phone || !password) {
            return res.status(400).json({ error: 'Name, phone, and password are required' });
        }

        const existing = await Worker.findOne({ phone });
        if (existing) return res.status(400).json({ error: 'A worker with this phone already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const worker = new Worker({
            name,
            phone,
            email: email || '',
            password: hashedPassword,
            specialization: specialization || [],
            photo: photo || ''
        });

        await worker.save();

        const workerData = worker.toObject();
        delete workerData.password;
        res.status(201).json({ success: true, data: workerData });
    } catch (err) {
        console.error('Error creating worker:', err);
        res.status(500).json({ error: 'Failed to create worker' });
    }
};

// ─── Update worker (ADMIN) ───
const updateWorker = async (req, res) => {
    try {
        const { name, phone, email, specialization, photo, status, workingHours } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (phone) updates.phone = phone;
        if (email !== undefined) updates.email = email;
        if (specialization) updates.specialization = specialization;
        if (photo !== undefined) updates.photo = photo;
        if (status) updates.status = status;
        if (workingHours) updates.workingHours = workingHours;

        if (req.body.password) {
            updates.password = await bcrypt.hash(req.body.password, 10);
        }

        const worker = await Worker.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
        if (!worker) return res.status(404).json({ error: 'Worker not found' });

        res.json({ success: true, data: worker });
    } catch (err) {
        console.error('Error updating worker:', err);
        res.status(500).json({ error: 'Failed to update worker' });
    }
};

// ─── Delete worker (ADMIN) ───
const deleteWorker = async (req, res) => {
    try {
        await Worker.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting worker:', err);
        res.status(500).json({ error: 'Failed to delete worker' });
    }
};

// ─── Worker: Get assigned jobs ───
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Booking.find({
            assignedWorker: req.user.id,
            status: { $nin: ['Completed', 'Cancelled'] }
        }).sort({ priority: -1, createdAt: -1 });

        res.json(jobs);
    } catch (err) {
        console.error('Error fetching worker jobs:', err);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};

// ─── Worker: Update job status ───
const updateMyJobStatus = async (req, res) => {
    try {
        const { status, note, isVisibleToCustomer = true, photos = [] } = req.body;
        if (!status) return res.status(400).json({ error: 'Status is required' });

        const booking = await Booking.findOne({
            _id: req.params.bookingId,
            assignedWorker: req.user.id
        });

        if (!booking) return res.status(404).json({ error: 'Job not found or not assigned to you' });

        const oldStatus = booking.status;
        booking.status = status;
        await booking.save();

        await BookingUpdate.create({
            bookingId: booking._id,
            status,
            note: note || `Status updated to ${status}`,
            isVisibleToCustomer,
            photos,
            updatedBy: { type: 'worker', id: req.user.id, name: req.user.name }
        });

        // Notifications
        if (status === 'Completed') {
            notifyJobCompleted(booking).catch(err => console.error('[Notification Error]', err));
        } else if (status === 'Ready for Pickup') {
            notifyReadyForPickup(booking).catch(err => console.error('[Notification Error]', err));
        } else if (oldStatus !== status) {
            notifyStatusChange(booking, status).catch(err => console.error('[Notification Error]', err));
        }

        res.json({ success: true, data: booking });
    } catch (err) {
        console.error('Error updating job status:', err);
        res.status(500).json({ error: 'Failed to update job status' });
    }
};

// ─── Worker: Get job history ───
const getMyJobHistory = async (req, res) => {
    try {
        const { dateFrom, dateTo, page = 1, limit = 20 } = req.query;
        const filter = {
            assignedWorker: req.user.id,
            status: { $in: ['Completed', 'Cancelled'] }
        };

        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) filter.createdAt.$lte = new Date(dateTo + 'T23:59:59');
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [jobs, total] = await Promise.all([
            Booking.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(parseInt(limit)),
            Booking.countDocuments(filter)
        ]);

        res.json({ jobs, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        console.error('Error fetching job history:', err);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};

// ─── Worker: Update profile ───
const updateMyProfile = async (req, res) => {
    try {
        const { name, email, photo } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (email !== undefined) updates.email = email;
        if (photo !== undefined) updates.photo = photo;

        if (req.body.password) {
            updates.password = await bcrypt.hash(req.body.password, 10);
        }

        const worker = await Worker.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
        if (!worker) return res.status(404).json({ error: 'Worker not found' });

        res.json({ success: true, data: worker });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// ─── Worker: Get profile ───
const getMyProfile = async (req, res) => {
    try {
        const worker = await Worker.findById(req.user.id).select('-password');
        if (!worker) return res.status(404).json({ error: 'Worker not found' });
        res.json(worker);
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// ─── Get worker performance stats (ADMIN) ───
const getWorkerStats = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id).select('-password');
        if (!worker) return res.status(404).json({ error: 'Worker not found' });

        const [totalCompleted, totalActive, avgTimeResult] = await Promise.all([
            Booking.countDocuments({ assignedWorker: worker._id, status: 'Completed' }),
            Booking.countDocuments({ assignedWorker: worker._id, status: { $nin: ['Completed', 'Cancelled'] } }),
            Booking.aggregate([
                { $match: { assignedWorker: worker._id, status: 'Completed' } },
                { $project: { duration: { $subtract: ['$updatedAt', '$createdAt'] } } },
                { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
            ])
        ]);

        res.json({
            worker,
            stats: {
                totalCompleted,
                totalActive,
                avgCompletionTime: avgTimeResult[0]?.avgDuration || 0
            }
        });
    } catch (err) {
        console.error('Error fetching worker stats:', err);
        res.status(500).json({ error: 'Failed to fetch worker stats' });
    }
};

module.exports = {
    workerLogin,
    getWorkers,
    createWorker,
    updateWorker,
    deleteWorker,
    getMyJobs,
    updateMyJobStatus,
    getMyJobHistory,
    updateMyProfile,
    getMyProfile,
    getWorkerStats
};

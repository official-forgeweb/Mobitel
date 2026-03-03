const Booking = require('../models/Booking');
const BookingUpdate = require('../models/BookingUpdate');
const Worker = require('../models/Worker');
const { generateTrackingToken } = require('../services/tokenService');
const { notifyNewBooking, notifyStatusChange, notifyJobCompleted, notifyReadyForPickup } = require('../services/notificationService');

// ─── Create a new booking (PUBLIC) ───
const createBooking = async (req, res) => {
    try {
        const { customerName, phone, brand, model, serviceType } = req.body;
        if (!customerName || !phone || !brand || !model || !serviceType) {
            return res.status(400).json({ error: 'customerName, phone, brand, model, and serviceType are required' });
        }

        // Generate unique tracking token
        let trackingToken;
        let attempts = 0;
        do {
            trackingToken = generateTrackingToken();
            const exists = await Booking.findOne({ trackingToken });
            if (!exists) break;
            attempts++;
        } while (attempts < 10);

        const booking = new Booking({
            ...req.body,
            trackingToken,
            status: 'Received'
        });
        await booking.save();

        // Create initial booking update entry
        await BookingUpdate.create({
            bookingId: booking._id,
            status: 'Received',
            note: 'Booking received',
            isVisibleToCustomer: true,
            updatedBy: { type: 'system', name: 'System' }
        });

        // Send notifications (async, don't block response)
        notifyNewBooking(booking).catch(err => console.error('[Notification Error]', err));

        res.status(201).json({
            success: true,
            trackingToken: booking.trackingToken,
            data: booking
        });
    } catch (err) {
        console.error('Error creating booking:', err);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

// ─── Track booking by token (PUBLIC) ───
const trackBooking = async (req, res) => {
    try {
        const { token } = req.params;
        const booking = await Booking.findOne({ trackingToken: token.toUpperCase() })
            .populate('assignedWorker', 'name phone');

        if (!booking) {
            return res.status(404).json({ error: 'No booking found with this tracking token' });
        }

        // Get all customer-visible updates
        const updates = await BookingUpdate.find({
            bookingId: booking._id,
            isVisibleToCustomer: true
        }).sort({ createdAt: 1 });

        // Build timeline
        const timeline = updates.map(u => ({
            status: u.status,
            note: u.note,
            photos: u.photos,
            time: u.createdAt,
            updatedBy: u.updatedBy?.name || 'System'
        }));

        res.json({
            trackingToken: booking.trackingToken,
            brand: booking.brand,
            model: booking.model,
            serviceType: booking.serviceType,
            issue: booking.issue,
            status: booking.status,
            priority: booking.priority,
            estimatedCompletion: booking.estimatedCompletion,
            estimatedCost: booking.estimatedCost,
            customerNotes: booking.customerNotes,
            createdAt: booking.createdAt,
            assignedWorker: booking.assignedWorker ? {
                name: booking.assignedWorker.name.split(' ')[0] // First name only for privacy
            } : null,
            timeline
        });
    } catch (err) {
        console.error('Error tracking booking:', err);
        res.status(500).json({ error: 'Failed to track booking' });
    }
};

// ─── Get all bookings (ADMIN) ───
const getAllBookings = async (req, res) => {
    try {
        const { status, priority, worker, brand, dateFrom, dateTo, search, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (worker) filter.assignedWorker = worker;
        if (brand) filter.brand = { $regex: brand, $options: 'i' };
        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) filter.createdAt.$lte = new Date(dateTo + 'T23:59:59');
        }
        if (search) {
            filter.$or = [
                { trackingToken: { $regex: search, $options: 'i' } },
                { customerName: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [bookings, total] = await Promise.all([
            Booking.find(filter)
                .populate('assignedWorker', 'name phone')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Booking.countDocuments(filter)
        ]);

        res.json({
            bookings,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        });
    } catch (err) {
        console.error('Error fetching bookings:', err);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

// ─── Get single booking (ADMIN) ───
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('assignedWorker', 'name phone email specialization');

        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        const updates = await BookingUpdate.find({ bookingId: booking._id }).sort({ createdAt: 1 });

        res.json({ booking, updates });
    } catch (err) {
        console.error('Error fetching booking:', err);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
};

// ─── Update booking status (ADMIN/WORKER) ───
const updateBookingStatus = async (req, res) => {
    try {
        const { status, note, isVisibleToCustomer = true, photos = [] } = req.body;
        if (!status) return res.status(400).json({ error: 'Status is required' });

        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        const oldStatus = booking.status;
        booking.status = status;
        await booking.save();

        // Create update entry
        await BookingUpdate.create({
            bookingId: booking._id,
            status,
            note: note || `Status changed to ${status}`,
            isVisibleToCustomer,
            photos,
            updatedBy: {
                type: req.user.role,
                id: req.user.id || null,
                name: req.user.name || req.user.role
            }
        });

        // Trigger notifications based on status
        if (status === 'Completed') {
            notifyJobCompleted(booking).catch(err => console.error('[Notification Error]', err));
        } else if (status === 'Ready for Pickup') {
            notifyReadyForPickup(booking).catch(err => console.error('[Notification Error]', err));
        } else if (oldStatus !== status) {
            notifyStatusChange(booking, status).catch(err => console.error('[Notification Error]', err));
        }

        res.json({ success: true, data: booking });
    } catch (err) {
        console.error('Error updating booking status:', err);
        res.status(500).json({ error: 'Failed to update status' });
    }
};

// ─── Assign worker (ADMIN) ───
const assignWorker = async (req, res) => {
    try {
        const { workerId } = req.body;
        if (!workerId) return res.status(400).json({ error: 'workerId is required' });

        const worker = await Worker.findById(workerId);
        if (!worker) return res.status(404).json({ error: 'Worker not found' });

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { assignedWorker: workerId },
            { new: true }
        ).populate('assignedWorker', 'name phone');

        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        // Log the assignment
        await BookingUpdate.create({
            bookingId: booking._id,
            status: booking.status,
            note: `Assigned to technician: ${worker.name}`,
            isVisibleToCustomer: true,
            updatedBy: { type: 'admin', name: 'Admin' }
        });

        res.json({ success: true, data: booking });
    } catch (err) {
        console.error('Error assigning worker:', err);
        res.status(500).json({ error: 'Failed to assign worker' });
    }
};

// ─── Add note to booking (ADMIN/WORKER) ───
const addBookingNote = async (req, res) => {
    try {
        const { note, isVisibleToCustomer = false, photos = [] } = req.body;
        if (!note) return res.status(400).json({ error: 'Note is required' });

        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        const update = await BookingUpdate.create({
            bookingId: booking._id,
            status: booking.status,
            note,
            isVisibleToCustomer,
            photos,
            updatedBy: {
                type: req.user.role,
                id: req.user.id || null,
                name: req.user.name || req.user.role
            }
        });

        res.status(201).json({ success: true, data: update });
    } catch (err) {
        console.error('Error adding note:', err);
        res.status(500).json({ error: 'Failed to add note' });
    }
};

// ─── Cancel booking (ADMIN) ───
const cancelBooking = async (req, res) => {
    try {
        const { reason } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        booking.status = 'Cancelled';
        booking.cancellationReason = reason || '';
        await booking.save();

        await BookingUpdate.create({
            bookingId: booking._id,
            status: 'Cancelled',
            note: `Booking cancelled${reason ? ': ' + reason : ''}`,
            isVisibleToCustomer: true,
            updatedBy: { type: 'admin', name: 'Admin' }
        });

        res.json({ success: true, data: booking });
    } catch (err) {
        console.error('Error cancelling booking:', err);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
};

// ─── Update booking details (ADMIN) ───
const updateBooking = async (req, res) => {
    try {
        const allowedFields = ['priority', 'estimatedCompletion', 'estimatedCost', 'internalNotes', 'customerNotes'];
        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        }

        const booking = await Booking.findByIdAndUpdate(req.params.id, updates, { new: true })
            .populate('assignedWorker', 'name phone');

        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        res.json({ success: true, data: booking });
    } catch (err) {
        console.error('Error updating booking:', err);
        res.status(500).json({ error: 'Failed to update booking' });
    }
};

// ─── Booking stats for dashboard (ADMIN) ───
const getBookingStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        const [
            todayCount,
            weekCount,
            monthCount,
            pendingCount,
            inProgressCount,
            completedCount,
            totalCount,
            recentBookings,
            workerStats
        ] = await Promise.all([
            Booking.countDocuments({ createdAt: { $gte: today } }),
            Booking.countDocuments({ createdAt: { $gte: weekAgo } }),
            Booking.countDocuments({ createdAt: { $gte: monthAgo } }),
            Booking.countDocuments({ status: 'Received' }),
            Booking.countDocuments({ status: { $in: ['Diagnosing', 'Waiting for Parts', 'In Progress', 'Testing'] } }),
            Booking.countDocuments({ status: 'Completed' }),
            Booking.countDocuments(),
            Booking.find().sort({ createdAt: -1 }).limit(10).populate('assignedWorker', 'name'),
            Worker.aggregate([
                { $match: { status: 'active' } },
                {
                    $lookup: {
                        from: 'bookings',
                        let: { workerId: '$_id' },
                        pipeline: [
                            { $match: { $expr: { $and: [{ $eq: ['$assignedWorker', '$$workerId'] }, { $ne: ['$status', 'Completed'] }, { $ne: ['$status', 'Cancelled'] }] } } }
                        ],
                        as: 'activeJobs'
                    }
                },
                { $project: { name: 1, phone: 1, specialization: 1, status: 1, activeJobCount: { $size: '$activeJobs' } } }
            ])
        ]);

        res.json({
            today: todayCount,
            week: weekCount,
            month: monthCount,
            pending: pendingCount,
            inProgress: inProgressCount,
            completed: completedCount,
            total: totalCount,
            recentBookings,
            workers: workerStats
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

module.exports = {
    createBooking,
    trackBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    assignWorker,
    addBookingNote,
    cancelBooking,
    updateBooking,
    getBookingStats
};

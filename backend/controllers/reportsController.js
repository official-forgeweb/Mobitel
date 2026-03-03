const Booking = require('../models/Booking');
const Worker = require('../models/Worker');

// ─── Bookings Report ───
const getBookingsReport = async (req, res) => {
    try {
        const { dateFrom, dateTo, status, brand, serviceType } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (brand) filter.brand = { $regex: brand, $options: 'i' };
        if (serviceType) filter.serviceType = { $regex: serviceType, $options: 'i' };
        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) filter.createdAt.$lte = new Date(dateTo + 'T23:59:59');
        }

        const bookings = await Booking.find(filter)
            .populate('assignedWorker', 'name')
            .sort({ createdAt: -1 });

        // Status breakdown
        const statusBreakdown = await Booking.aggregate([
            { $match: filter },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({ bookings, statusBreakdown, total: bookings.length });
    } catch (err) {
        console.error('Error generating bookings report:', err);
        res.status(500).json({ error: 'Failed to generate report' });
    }
};

// ─── Revenue Report ───
const getRevenueReport = async (req, res) => {
    try {
        const { dateFrom, dateTo } = req.query;
        const filter = { status: 'Completed' };
        if (dateFrom || dateTo) {
            filter.updatedAt = {};
            if (dateFrom) filter.updatedAt.$gte = new Date(dateFrom);
            if (dateTo) filter.updatedAt.$lte = new Date(dateTo + 'T23:59:59');
        }

        const revenue = await Booking.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalBookings: { $sum: 1 },
                    // Attempt to extract numeric revenue from estimatedCost string
                }
            }
        ]);

        // Daily breakdown
        const dailyBreakdown = await Booking.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            totalCompleted: revenue[0]?.totalBookings || 0,
            dailyBreakdown
        });
    } catch (err) {
        console.error('Error generating revenue report:', err);
        res.status(500).json({ error: 'Failed to generate revenue report' });
    }
};

// ─── Worker Performance Report ───
const getWorkerPerformanceReport = async (req, res) => {
    try {
        const workers = await Worker.aggregate([
            {
                $lookup: {
                    from: 'bookings',
                    localField: '_id',
                    foreignField: 'assignedWorker',
                    as: 'bookings'
                }
            },
            {
                $project: {
                    name: 1,
                    phone: 1,
                    specialization: 1,
                    status: 1,
                    totalJobs: { $size: '$bookings' },
                    completedJobs: {
                        $size: {
                            $filter: { input: '$bookings', as: 'b', cond: { $eq: ['$$b.status', 'Completed'] } }
                        }
                    },
                    activeJobs: {
                        $size: {
                            $filter: {
                                input: '$bookings', as: 'b',
                                cond: { $and: [{ $ne: ['$$b.status', 'Completed'] }, { $ne: ['$$b.status', 'Cancelled'] }] }
                            }
                        }
                    }
                }
            },
            { $sort: { completedJobs: -1 } }
        ]);

        res.json(workers);
    } catch (err) {
        console.error('Error generating worker report:', err);
        res.status(500).json({ error: 'Failed to generate worker report' });
    }
};

// ─── Popular Services Report ───
const getPopularServicesReport = async (req, res) => {
    try {
        const services = await Booking.aggregate([
            { $group: { _id: '$serviceType', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]);

        const brands = await Booking.aggregate([
            { $group: { _id: '$brand', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]);

        const models = await Booking.aggregate([
            { $group: { _id: { brand: '$brand', model: '$model' }, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]);

        res.json({ services, brands, models });
    } catch (err) {
        console.error('Error generating popular services report:', err);
        res.status(500).json({ error: 'Failed to generate report' });
    }
};

// ─── Export bookings as CSV ───
const exportBookingsCSV = async (req, res) => {
    try {
        const { dateFrom, dateTo, status } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) filter.createdAt.$lte = new Date(dateTo + 'T23:59:59');
        }

        const bookings = await Booking.find(filter).populate('assignedWorker', 'name').sort({ createdAt: -1 });

        // Build CSV
        const headers = ['Tracking Token', 'Customer Name', 'Phone', 'Email', 'Brand', 'Model', 'Service', 'Status', 'Priority', 'Worker', 'Created At'];
        const rows = bookings.map(b => [
            b.trackingToken,
            b.customerName,
            b.phone,
            b.email,
            b.brand,
            b.model,
            b.serviceType,
            b.status,
            b.priority,
            b.assignedWorker?.name || 'Unassigned',
            new Date(b.createdAt).toLocaleString()
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=bookings-report-${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csv);
    } catch (err) {
        console.error('Error exporting CSV:', err);
        res.status(500).json({ error: 'Failed to export CSV' });
    }
};

module.exports = { getBookingsReport, getRevenueReport, getWorkerPerformanceReport, getPopularServicesReport, exportBookingsCSV };

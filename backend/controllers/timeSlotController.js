const { TimeSlot, BlockedDate } = require('../models/TimeSlot');
const Booking = require('../models/Booking');

// ─── Get all time slots ───
const getTimeSlots = async (req, res) => {
    try {
        const slots = await TimeSlot.find().sort({ dayOfWeek: 1, startTime: 1 });
        res.json(slots);
    } catch (err) {
        console.error('Error fetching time slots:', err);
        res.status(500).json({ error: 'Failed to fetch time slots' });
    }
};

const createTimeSlot = async (req, res) => {
    try {
        const slot = new TimeSlot(req.body);
        await slot.save();
        res.status(201).json({ success: true, data: slot });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ error: 'Time slot already exists for this day/time' });
        console.error('Error creating time slot:', err);
        res.status(500).json({ error: 'Failed to create time slot' });
    }
};

const updateTimeSlot = async (req, res) => {
    try {
        const slot = await TimeSlot.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!slot) return res.status(404).json({ error: 'Time slot not found' });
        res.json({ success: true, data: slot });
    } catch (err) {
        console.error('Error updating time slot:', err);
        res.status(500).json({ error: 'Failed to update time slot' });
    }
};

const deleteTimeSlot = async (req, res) => {
    try {
        await TimeSlot.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting time slot:', err);
        res.status(500).json({ error: 'Failed to delete time slot' });
    }
};

// ─── Blocked Dates ───
const getBlockedDates = async (req, res) => {
    try {
        const dates = await BlockedDate.find().sort({ date: 1 });
        res.json(dates);
    } catch (err) {
        console.error('Error fetching blocked dates:', err);
        res.status(500).json({ error: 'Failed to fetch blocked dates' });
    }
};

const addBlockedDate = async (req, res) => {
    try {
        const bd = new BlockedDate(req.body);
        await bd.save();
        res.status(201).json({ success: true, data: bd });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ error: 'Date already blocked' });
        console.error('Error adding blocked date:', err);
        res.status(500).json({ error: 'Failed to add blocked date' });
    }
};

const removeBlockedDate = async (req, res) => {
    try {
        await BlockedDate.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error('Error removing blocked date:', err);
        res.status(500).json({ error: 'Failed to remove blocked date' });
    }
};

// ─── Check availability for a given date (PUBLIC) ───
const checkAvailability = async (req, res) => {
    try {
        const { date } = req.query; // "2026-03-15"
        if (!date) return res.status(400).json({ error: 'Date is required' });

        // Check if date is blocked
        const isBlocked = await BlockedDate.findOne({ date });
        if (isBlocked) {
            return res.json({ available: false, reason: isBlocked.reason || 'Shop is closed on this date', slots: [] });
        }

        // Get day of week
        const dayOfWeek = new Date(date).getDay();

        // Get active slots for this day
        const slots = await TimeSlot.find({ dayOfWeek, isActive: true }).sort({ startTime: 1 });

        // Count existing bookings for each slot on this date
        const slotsWithAvailability = await Promise.all(slots.map(async (slot) => {
            const bookedCount = await Booking.countDocuments({
                preferredDate: date,
                preferredTime: `${slot.startTime}-${slot.endTime}`,
                status: { $ne: 'Cancelled' }
            });

            return {
                _id: slot._id,
                startTime: slot.startTime,
                endTime: slot.endTime,
                maxBookings: slot.maxBookings,
                booked: bookedCount,
                available: bookedCount < slot.maxBookings
            };
        }));

        res.json({ available: true, slots: slotsWithAvailability });
    } catch (err) {
        console.error('Error checking availability:', err);
        res.status(500).json({ error: 'Failed to check availability' });
    }
};

module.exports = {
    getTimeSlots, createTimeSlot, updateTimeSlot, deleteTimeSlot,
    getBlockedDates, addBlockedDate, removeBlockedDate,
    checkAvailability
};

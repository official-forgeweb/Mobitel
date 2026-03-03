const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 }, // 0=Sunday, 6=Saturday
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true },   // "10:00"
    maxBookings: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

TimeSlotSchema.index({ dayOfWeek: 1, startTime: 1 }, { unique: true });

const BlockedDateSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true }, // "2026-03-15"
    reason: { type: String, default: '' }
}, { timestamps: true });

const TimeSlot = mongoose.model('TimeSlot', TimeSlotSchema);
const BlockedDate = mongoose.model('BlockedDate', BlockedDateSchema);

module.exports = { TimeSlot, BlockedDate };

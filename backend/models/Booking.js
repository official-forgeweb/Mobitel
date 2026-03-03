const mongoose = require('mongoose');

const BOOKING_STATUSES = [
    'Received',
    'Diagnosing',
    'Waiting for Parts',
    'In Progress',
    'Testing',
    'Ready for Pickup',
    'Completed',
    'Cancelled'
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const BookingSchema = new mongoose.Schema({
    trackingToken: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    serviceType: { type: String, required: true },
    issue: { type: String, default: '' },
    preferredDate: { type: String, default: '' },
    preferredTime: { type: String, default: '' },
    address: { type: String, default: '' },
    landmark: { type: String, default: '' },
    pincode: { type: String, default: '' },
    shopId: { type: String, default: '' },
    status: { type: String, enum: BOOKING_STATUSES, default: 'Received' },
    assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', default: null },
    priority: { type: String, enum: PRIORITIES, default: 'Medium' },
    estimatedCompletion: { type: Date, default: null },
    estimatedCost: { type: String, default: '' },
    internalNotes: { type: String, default: '' },
    customerNotes: { type: String, default: '' },
    cancellationReason: { type: String, default: '' }
}, { timestamps: true });

// Static helper for valid statuses
BookingSchema.statics.STATUSES = BOOKING_STATUSES;
BookingSchema.statics.PRIORITIES = PRIORITIES;

module.exports = mongoose.model('Booking', BookingSchema);

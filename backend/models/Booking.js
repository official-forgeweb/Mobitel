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

const PAYMENT_MODES = ['online_full', 'online_advance', 'pay_at_store'];
const PAYMENT_STATUSES = ['pending', 'paid', 'partially_paid', 'failed', 'refunded', 'partially_refunded'];
const REFUND_STATUSES = ['none', 'initiated', 'processed', 'failed'];

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
    cancellationReason: { type: String, default: '' },

    // ─── Payment Fields ───
    payment_mode: { type: String, enum: PAYMENT_MODES },
    payment_status: { type: String, enum: PAYMENT_STATUSES, default: 'pending' },
    total_amount: { type: Number, default: 0 },
    advance_amount: { type: Number, default: 0 },
    amount_paid_online: { type: Number, default: 0 },
    amount_paid_at_store: { type: Number, default: 0 },
    amount_due: { type: Number, default: 0 },

    // ─── Razorpay Fields ───
    razorpay_order_id: { type: String, default: '' },
    razorpay_payment_id: { type: String, default: '' },
    razorpay_signature: { type: String, default: '' },
    payment_date: { type: Date, default: null },

    // ─── Store Collection ───
    store_collection_date: { type: Date, default: null },
    store_collected_by: { type: String, default: '' },

    // ─── Refund Fields ───
    refund_status: { type: String, enum: REFUND_STATUSES, default: 'none' },
    refund_type: { type: String, enum: ['full', 'partial'], default: null },
    refund_amount: { type: Number, default: 0 },
    razorpay_refund_id: { type: String, default: '' },
    refund_reason: { type: String, default: '' },
    refund_initiated_by: { type: String, default: '' },
    refund_initiated_at: { type: Date, default: null },
    refund_processed_at: { type: Date, default: null }
}, { timestamps: true });

// Static helper for valid statuses
BookingSchema.statics.STATUSES = BOOKING_STATUSES;
BookingSchema.statics.PRIORITIES = PRIORITIES;

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

const mongoose = require('mongoose');

const NotificationLogSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
    channel: { type: String, enum: ['email', 'whatsapp', 'sms'], required: true },
    recipient: { type: String, required: true },
    event: { type: String, required: true }, // e.g., 'booking_created', 'status_changed', 'job_completed'
    status: { type: String, enum: ['sent', 'failed'], required: true },
    error: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.models.NotificationLog || mongoose.model('NotificationLog', NotificationLogSchema);

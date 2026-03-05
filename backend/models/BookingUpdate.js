const mongoose = require('mongoose');

const BookingUpdateSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
    status: { type: String, default: '' },
    note: { type: String, default: '' },
    isVisibleToCustomer: { type: Boolean, default: true },
    photos: [{ type: String }], // cloudinary URLs
    updatedBy: {
        type: { type: String, enum: ['admin', 'worker', 'system'], default: 'system' },
        id: { type: mongoose.Schema.Types.ObjectId, default: null },
        name: { type: String, default: 'System' }
    }
}, { timestamps: true });

module.exports = mongoose.models.BookingUpdate || mongoose.model('BookingUpdate', BookingUpdateSchema);

const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    brand: String,
    model: String,
    issue: String,
    serviceType: String,
    customerName: String,
    phone: String,
    email: String,
    preferredDate: String,
    preferredTime: String,
    address: String,
    landmark: String,
    pincode: String,
    shopId: String,
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.models.Request || mongoose.model('Request', RequestSchema);

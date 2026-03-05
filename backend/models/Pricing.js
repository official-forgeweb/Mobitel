const mongoose = require('mongoose');

const PricingSchema = new mongoose.Schema({
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    modelId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeviceModel', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    price: { type: Number, required: true },
    priceMax: { type: Number, default: null }, // for price ranges e.g., $49-$79
    estimatedTime: { type: String, default: '' }, // e.g., "1-2 hours"
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

// Compound index: unique pricing per brand+model+service combination
PricingSchema.index({ brandId: 1, modelId: 1, serviceId: 1 }, { unique: true });

module.exports = mongoose.models.Pricing || mongoose.model('', PricingSchema);

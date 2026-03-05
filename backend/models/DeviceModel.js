const mongoose = require('mongoose');

const DeviceModelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    specs: { type: mongoose.Schema.Types.Mixed, default: {} } // storage variants, color, year, etc.
}, { timestamps: true });

// Compound index: unique model name per brand
DeviceModelSchema.index({ name: 1, brandId: 1 }, { unique: true });

module.exports = mongoose.models.DeviceModel || mongoose.model('DeviceModel', DeviceModelSchema);

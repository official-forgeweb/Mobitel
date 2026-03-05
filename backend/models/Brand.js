const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    logo: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.models.Brand || mongoose.model('Brand', BrandSchema);

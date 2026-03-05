const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String }
}, { timestamps: true });

module.exports = mongoose.models.Shop || mongoose.model('', ShopSchema);

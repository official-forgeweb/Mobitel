const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: 'active' } // active, inactive
}, { timestamps: true });

module.exports = mongoose.model('Partner', PartnerSchema);

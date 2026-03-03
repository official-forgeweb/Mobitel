const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, default: '' },
    password: { type: String, required: true },
    photo: { type: String, default: '' },
    specialization: [{ type: String }], // e.g., ['screen repair', 'motherboard', 'software']
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    workingHours: {
        type: Map,
        of: { start: String, end: String },
        default: {}
    }
}, { timestamps: true });

module.exports = mongoose.model('Worker', WorkerSchema);

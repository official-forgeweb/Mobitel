const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, default: null }
}, { timestamps: true });

// Prevent mongoose from over-writing mixed-type changes
SettingSchema.pre('save', function () {
    this.markModified('value');
});

module.exports = mongoose.model('Setting', SettingSchema);

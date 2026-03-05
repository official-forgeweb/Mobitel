const mongoose = require('mongoose');

const CmsSchema = new mongoose.Schema({
    pageSlug: { type: String, required: true, unique: true }, // e.g., 'home', 'about', 'services'
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

// Prevent mongoose from over-writing mixed-type changes
CmsSchema.pre('save', function (next) {
    this.markModified('data');
    next();
});

module.exports = mongoose.models.Cms || mongoose.model('Cms', CmsSchema);

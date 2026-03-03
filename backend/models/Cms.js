const mongoose = require('mongoose');

const CmsSchema = new mongoose.Schema({
    pageSlug: { type: String, required: true, unique: true }, // e.g., 'home', 'about', 'services'
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

// Prevent mongoose from over-writing mixed-type changes
CmsSchema.pre('save', function () {
    this.markModified('data');
});

module.exports = mongoose.model('Cms', CmsSchema);

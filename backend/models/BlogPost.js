const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, maxlength: 300 },
    content: { type: String, required: true },
    featured_image: { type: String, default: '' },
    featured_image_alt: { type: String, default: '' },
    category: { type: String, default: 'General', enum: ['Tips', 'Guides', 'News', 'Comparisons', 'General'] },
    tags: [{ type: String }],
    author_name: { type: String, default: 'Mobitel Team' },
    meta_title: { type: String },
    meta_description: { type: String },
    meta_keywords: [{ type: String }],
    is_published: { type: Boolean, default: false },
    published_at: { type: Date },
    read_time_minutes: { type: Number, default: 5 },
    views_count: { type: Number, default: 0 },
}, { timestamps: true });

// Auto-generate slug from title
BlogPostSchema.pre('validate', function () {
    if (this.title && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
    // Auto-calculate read time (avg 200 words per minute)
    if (this.content) {
        const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        this.read_time_minutes = Math.max(1, Math.ceil(wordCount / 200));
    }
    // Auto-fill meta fields
    if (!this.meta_title) this.meta_title = this.title;
    if (!this.meta_description && this.excerpt) this.meta_description = this.excerpt;
});

// Index for efficient querying
BlogPostSchema.index({ is_published: 1, published_at: -1 });
BlogPostSchema.index({ category: 1 });
BlogPostSchema.index({ tags: 1 });

module.exports = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

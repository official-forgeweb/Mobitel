const BlogPost = require('../models/BlogPost');

// GET /api/blog — List published posts (public)
const getPublishedPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, tag } = req.query;
        const query = { is_published: true, published_at: { $lte: new Date() } };

        if (category) query.category = category;
        if (tag) query.tags = tag;

        const posts = await BlogPost.find(query)
            .select('-content') // Don't send full content in list
            .sort({ published_at: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await BlogPost.countDocuments(query);

        res.json({
            posts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blog posts', details: error.message });
    }
};

// GET /api/blog/:slug — Get single post by slug (public)
const getPostBySlug = async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug, is_published: true });
        if (!post) return res.status(404).json({ error: 'Post not found' });

        // Increment views
        post.views_count = (post.views_count || 0) + 1;
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blog post', details: error.message });
    }
};

// GET /api/blog/admin/all — List ALL posts (admin)
const getAllPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find()
            .select('-content')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
    }
};

// POST /api/blog/admin — Create new post (admin)
const createPost = async (req, res) => {
    try {
        const post = new BlogPost(req.body);
        if (req.body.is_published && !req.body.published_at) {
            post.published_at = new Date();
        }
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'A post with this slug already exists' });
        }
        res.status(500).json({ error: 'Failed to create post', details: error.message });
    }
};

// PUT /api/blog/admin/:id — Update post (admin)
const updatePost = async (req, res) => {
    try {
        const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post', details: error.message });
    }
};

// DELETE /api/blog/admin/:id — Delete post (admin)
const deletePost = async (req, res) => {
    try {
        const post = await BlogPost.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post', details: error.message });
    }
};

module.exports = {
    getPublishedPosts,
    getPostBySlug,
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
};

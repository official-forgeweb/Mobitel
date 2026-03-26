const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const {
    getPublishedPosts,
    getPostBySlug,
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
} = require('../controllers/blogController');

// Public routes
router.get('/', getPublishedPosts);
router.get('/post/:slug', getPostBySlug);

// Admin routes
router.get('/admin/all', verifyToken, requireAdmin, getAllPosts);
router.post('/admin', verifyToken, requireAdmin, createPost);
router.put('/admin/:id', verifyToken, requireAdmin, updatePost);
router.delete('/admin/:id', verifyToken, requireAdmin, deletePost);

module.exports = router;

const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const { getServices, createService, updateService, deleteService } = require('../controllers/serviceController');

// Public
router.get('/', getServices);

// Admin
router.post('/', verifyToken, requireAdmin, createService);
router.put('/:id', verifyToken, requireAdmin, updateService);
router.delete('/:id', verifyToken, requireAdmin, deleteService);

module.exports = router;

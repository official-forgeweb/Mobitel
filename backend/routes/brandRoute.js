const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const { getBrands, createBrand, updateBrand, deleteBrand } = require('../controllers/brandController');

// Public
router.get('/', getBrands);

// Admin
router.post('/', verifyToken, requireAdmin, createBrand);
router.put('/:id', verifyToken, requireAdmin, updateBrand);
router.delete('/:id', verifyToken, requireAdmin, deleteBrand);

module.exports = router;

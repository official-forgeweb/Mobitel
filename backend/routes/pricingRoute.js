const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const { getPricing, createPricing, updatePricing, deletePricing, bulkUpdatePricing, getPricingForModel } = require('../controllers/pricingController');

// Public
router.get('/', getPricing);
router.get('/model/:brandId/:modelId', getPricingForModel);

// Admin
router.post('/', verifyToken, requireAdmin, createPricing);
router.post('/bulk', verifyToken, requireAdmin, bulkUpdatePricing);
router.put('/:id', verifyToken, requireAdmin, updatePricing);
router.delete('/:id', verifyToken, requireAdmin, deletePricing);

module.exports = router;

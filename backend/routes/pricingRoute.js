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
router.post('/initialize', verifyToken, requireAdmin, async (req, res) => {
    const { brandId, modelId } = req.body;
    const Service = require('../models/Service');
    const Pricing = require('../models/Pricing');
    try {
        const defaultServices = await Service.find({ isDefault: true, isActive: true });
        const results = [];
        for (const svc of defaultServices) {
            const exists = await Pricing.findOne({ brandId, modelId, serviceId: svc._id });
            if (!exists) {
                const p = new Pricing({ brandId, modelId, serviceId: svc._id, price: 0, isAvailable: true });
                await p.save();
                results.push(p);
            }
        }
        res.json({ success: true, initialized: results.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put('/:id', verifyToken, requireAdmin, updatePricing);
router.delete('/:id', verifyToken, requireAdmin, deletePricing);

module.exports = router;

const Pricing = require('../models/Pricing');

const getPricing = async (req, res) => {
    try {
        const { brandId, modelId, serviceId, available } = req.query;
        const filter = {};
        if (brandId) filter.brandId = brandId;
        if (modelId) filter.modelId = modelId;
        if (serviceId) filter.serviceId = serviceId;
        if (available === 'true') filter.isAvailable = true;

        const pricing = await Pricing.find(filter)
            .populate('brandId', 'name')
            .populate('modelId', 'name')
            .populate('serviceId', 'name')
            .sort({ createdAt: -1 });

        res.json(pricing);
    } catch (err) {
        console.error('Error fetching pricing:', err);
        res.status(500).json({ error: 'Failed to fetch pricing' });
    }
};

const createPricing = async (req, res) => {
    try {
        const { brandId, modelId, serviceId, price } = req.body;
        if (!brandId || !modelId || !serviceId || price === undefined) {
            return res.status(400).json({ error: 'brandId, modelId, serviceId, and price are required' });
        }
        const pricing = new Pricing(req.body);
        await pricing.save();
        res.status(201).json({ success: true, data: pricing });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ error: 'Pricing for this combination already exists' });
        console.error('Error creating pricing:', err);
        res.status(500).json({ error: 'Failed to create pricing' });
    }
};

const updatePricing = async (req, res) => {
    try {
        const pricing = await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pricing) return res.status(404).json({ error: 'Pricing not found' });
        res.json({ success: true, data: pricing });
    } catch (err) {
        console.error('Error updating pricing:', err);
        res.status(500).json({ error: 'Failed to update pricing' });
    }
};

const deletePricing = async (req, res) => {
    try {
        await Pricing.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting pricing:', err);
        res.status(500).json({ error: 'Failed to delete pricing' });
    }
};

// Bulk create/update pricing
const bulkUpdatePricing = async (req, res) => {
    try {
        const { items } = req.body; // Array of { brandId, modelId, serviceId, price, priceMax, estimatedTime, isAvailable }
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'items array is required' });
        }

        const results = [];
        for (const item of items) {
            const existing = await Pricing.findOne({
                brandId: item.brandId,
                modelId: item.modelId,
                serviceId: item.serviceId
            });

            if (existing) {
                Object.assign(existing, item);
                await existing.save();
                results.push(existing);
            } else {
                const newPricing = new Pricing(item);
                await newPricing.save();
                results.push(newPricing);
            }
        }

        res.json({ success: true, data: results, count: results.length });
    } catch (err) {
        console.error('Error bulk updating pricing:', err);
        res.status(500).json({ error: 'Failed to bulk update pricing' });
    }
};

// Get pricing for a specific brand+model combination (PUBLIC for frontend booking)
const getPricingForModel = async (req, res) => {
    try {
        const { brandId, modelId } = req.params;
        const pricing = await Pricing.find({ brandId, modelId, isAvailable: true })
            .populate('serviceId', 'name description icon');
        res.json(pricing);
    } catch (err) {
        console.error('Error fetching pricing for model:', err);
        res.status(500).json({ error: 'Failed to fetch pricing' });
    }
};

module.exports = { getPricing, createPricing, updatePricing, deletePricing, bulkUpdatePricing, getPricingForModel };

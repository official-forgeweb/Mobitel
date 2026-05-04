const Pricing = require('../models/Pricing');
const { clearCache } = require('../middleware/cache');

const getPricing = async (req, res) => {
    try {
        const { brandId, modelId, serviceId, available } = req.query;
        const filter = {};
        if (brandId) filter.brandId = brandId;
        if (modelId) filter.modelId = modelId;
        if (serviceId) filter.serviceId = serviceId;
        if (available === 'true') filter.isAvailable = true;

        const pricing = await Pricing.find(filter)
            .populate('brandId', 'name isActive')
            .populate('modelId', 'name isActive')
            .populate('serviceId', 'name isActive')
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
        clearCache('/api/pricing');
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
        clearCache('/api/pricing');
        res.json({ success: true, data: pricing });
    } catch (err) {
        console.error('Error updating pricing:', err);
        res.status(500).json({ error: 'Failed to update pricing' });
    }
};

const deletePricing = async (req, res) => {
    try {
        await Pricing.findByIdAndDelete(req.params.id);
        clearCache('/api/pricing');
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

        clearCache('/api/pricing');
        res.json({ success: true, data: results, count: results.length });
    } catch (err) {
        console.error('Error bulk updating pricing:', err);
        res.status(500).json({ error: 'Failed to bulk update pricing' });
    }
};

// Get pricing for a specific brand+model combination (PUBLIC for frontend booking)
// Always returns ALL active services — uses custom pricing where it exists,
// falls back to default service price otherwise. Hides only if isAvailable === false.
const getPricingForModel = async (req, res) => {
    try {
        const { brandId, modelId } = req.params;
        const Service = require('../models/Service');

        // 1. Fetch all active services
        const allServices = await Service.find({ isActive: true }).sort({ displayOrder: 1 });

        // 2. Fetch all custom pricing for this brand+model (including isAvailable: false)
        const customPricing = await Pricing.find({ brandId, modelId })
            .populate('serviceId', 'name description icon');

        // 3. Build a map of serviceId -> pricing entry for quick lookup
        const pricingMap = {};
        for (const p of customPricing) {
            const sid = p.serviceId?._id?.toString() || p.serviceId?.toString();
            if (sid) pricingMap[sid] = p;
        }

        // 4. Merge: for each service, use custom pricing if exists, else default
        const merged = [];
        for (const svc of allServices) {
            const sid = svc._id.toString();
            const custom = pricingMap[sid];

            if (custom) {
                // Custom pricing exists — skip if explicitly disabled
                if (custom.isAvailable === false) continue;
                merged.push({
                    _id: custom._id,
                    brandId: custom.brandId,
                    modelId: custom.modelId,
                    serviceId: { _id: svc._id, name: svc.name, description: svc.description, icon: svc.icon },
                    price: custom.price,
                    priceMax: custom.priceMax || null,
                    estimatedTime: custom.estimatedTime || '',
                    isAvailable: true
                });
            } else {
                // No custom pricing — use default service price
                merged.push({
                    _id: `default_${sid}`,
                    brandId,
                    modelId,
                    serviceId: { _id: svc._id, name: svc.name, description: svc.description, icon: svc.icon },
                    price: svc.defaultPrice || 0,
                    priceMax: null,
                    estimatedTime: '',
                    isAvailable: true
                });
            }
        }

        res.json(merged);
    } catch (err) {
        console.error('Error fetching pricing for model:', err);
        res.status(500).json({ error: 'Failed to fetch pricing' });
    }
};

module.exports = { getPricing, createPricing, updatePricing, deletePricing, bulkUpdatePricing, getPricingForModel };

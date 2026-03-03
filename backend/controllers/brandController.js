const Brand = require('../models/Brand');

const getBrands = async (req, res) => {
    try {
        const { active } = req.query;
        const filter = {};
        if (active === 'true') filter.isActive = true;
        const brands = await Brand.find(filter).sort({ displayOrder: 1, name: 1 });
        res.json(brands);
    } catch (err) {
        console.error('Error fetching brands:', err);
        res.status(500).json({ error: 'Failed to fetch brands' });
    }
};

const createBrand = async (req, res) => {
    try {
        const { name, logo, displayOrder } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });
        const brand = new Brand({ name, logo: logo || '', displayOrder: displayOrder || 0 });
        await brand.save();
        res.status(201).json({ success: true, data: brand });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ error: 'Brand already exists' });
        console.error('Error creating brand:', err);
        res.status(500).json({ error: 'Failed to create brand' });
    }
};

const updateBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!brand) return res.status(404).json({ error: 'Brand not found' });
        res.json({ success: true, data: brand });
    } catch (err) {
        console.error('Error updating brand:', err);
        res.status(500).json({ error: 'Failed to update brand' });
    }
};

const deleteBrand = async (req, res) => {
    try {
        await Brand.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting brand:', err);
        res.status(500).json({ error: 'Failed to delete brand' });
    }
};

module.exports = { getBrands, createBrand, updateBrand, deleteBrand };

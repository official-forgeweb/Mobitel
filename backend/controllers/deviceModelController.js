const DeviceModel = require('../models/DeviceModel');

const getDeviceModels = async (req, res) => {
    try {
        const { brandId, active } = req.query;
        const filter = {};
        if (brandId) filter.brandId = brandId;
        if (active === 'true') filter.isActive = true;
        const models = await DeviceModel.find(filter).populate('brandId', 'name').sort({ displayOrder: 1, name: 1 });
        res.json(models);
    } catch (err) {
        console.error('Error fetching device models:', err);
        res.status(500).json({ error: 'Failed to fetch models' });
    }
};

const createDeviceModel = async (req, res) => {
    try {
        const { name, brandId, image, displayOrder, specs } = req.body;
        if (!name || !brandId) return res.status(400).json({ error: 'Name and brandId are required' });
        const model = new DeviceModel({ name, brandId, image: image || '', displayOrder: displayOrder || 0, specs: specs || {} });
        await model.save();
        res.status(201).json({ success: true, data: model });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ error: 'Model already exists for this brand' });
        console.error('Error creating device model:', err);
        res.status(500).json({ error: 'Failed to create model' });
    }
};

const updateDeviceModel = async (req, res) => {
    try {
        const model = await DeviceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!model) return res.status(404).json({ error: 'Model not found' });
        res.json({ success: true, data: model });
    } catch (err) {
        console.error('Error updating device model:', err);
        res.status(500).json({ error: 'Failed to update model' });
    }
};

const deleteDeviceModel = async (req, res) => {
    try {
        await DeviceModel.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting device model:', err);
        res.status(500).json({ error: 'Failed to delete model' });
    }
};

module.exports = { getDeviceModels, createDeviceModel, updateDeviceModel, deleteDeviceModel };

const Service = require('../models/Service');

const getServices = async (req, res) => {
    try {
        const { active } = req.query;
        const filter = {};
        if (active === 'true') filter.isActive = true;
        const services = await Service.find(filter).sort({ displayOrder: 1, name: 1 });
        res.json(services);
    } catch (err) {
        console.error('Error fetching services:', err);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
};

const createService = async (req, res) => {
    try {
        const { name, description, icon, displayOrder } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });
        const service = new Service({ name, description: description || '', icon: icon || '', displayOrder: displayOrder || 0 });
        await service.save();
        res.status(201).json({ success: true, data: service });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ error: 'Service already exists' });
        console.error('Error creating service:', err);
        res.status(500).json({ error: 'Failed to create service' });
    }
};

const updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!service) return res.status(404).json({ error: 'Service not found' });
        res.json({ success: true, data: service });
    } catch (err) {
        console.error('Error updating service:', err);
        res.status(500).json({ error: 'Failed to update service' });
    }
};

const deleteService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting service:', err);
        res.status(500).json({ error: 'Failed to delete service' });
    }
};

module.exports = { getServices, createService, updateService, deleteService };

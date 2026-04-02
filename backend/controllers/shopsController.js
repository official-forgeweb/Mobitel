const Shop = require('../models/Shop');

const getShops = async (req, res) => {
    try {
        const query = {};
        if (req.query.active === 'true') query.isActive = true;
        const shops = await Shop.find(query).sort({ createdAt: -1 });
        res.json(shops);
    } catch (err) {
        console.error("Error reading shops data from MongoDB:", err);
        res.status(500).json({ error: 'Failed to read shops data' });
    }
};

const updateShop = async (req, res) => {
    try {
        const { id } = req.params;
        const shop = await Shop.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, data: shop });
    } catch (err) {
        console.error("Error updating shop in MongoDB:", err);
        res.status(500).json({ error: 'Failed to update shop' });
    }
};

const addShop = async (req, res) => {
    try {
        const newShop = new Shop({
            name: req.body.name,
            address: req.body.address,
            contact: req.body.contact || '',
            isActive: true
        });

        await newShop.save();
        res.status(201).json({ success: true, data: newShop });
    } catch (err) {
        console.error("Error adding shop to MongoDB:", err);
        res.status(500).json({ error: 'Failed to add shop' });
    }
};

const deleteShop = async (req, res) => {
    try {
        const { id } = req.params;
        await Shop.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (err) {
        console.error("Error deleting shop from MongoDB:", err);
        res.status(500).json({ error: 'Failed to delete shop' });
    }
};

module.exports = { getShops, addShop, deleteShop, updateShop };

const Shop = require('../models/Shop');

const getShops = async (req, res) => {
    try {
        const shops = await Shop.find().sort({ createdAt: -1 });
        res.json(shops);
    } catch (err) {
        console.error("Error reading shops data from MongoDB:", err);
        res.status(500).json({ error: 'Failed to read shops data' });
    }
};

const addShop = async (req, res) => {
    try {
        const newShop = new Shop({
            name: req.body.name,
            address: req.body.address,
            contact: req.body.contact || ''
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

module.exports = { getShops, addShop, deleteShop };

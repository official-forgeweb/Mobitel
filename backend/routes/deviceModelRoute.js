const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const { getDeviceModels, createDeviceModel, updateDeviceModel, deleteDeviceModel } = require('../controllers/deviceModelController');

// Public
router.get('/', getDeviceModels);

// Admin
router.post('/', verifyToken, requireAdmin, createDeviceModel);
router.put('/:id', verifyToken, requireAdmin, updateDeviceModel);
router.delete('/:id', verifyToken, requireAdmin, deleteDeviceModel);

module.exports = router;

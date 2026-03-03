const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const { getSetting, updateSetting, getAllSettings } = require('../controllers/settingsController');

router.get('/', verifyToken, requireAdmin, getAllSettings);
router.get('/:key', verifyToken, requireAdmin, getSetting);
router.put('/:key', verifyToken, requireAdmin, updateSetting);

module.exports = router;

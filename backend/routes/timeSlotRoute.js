const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const {
    getTimeSlots, createTimeSlot, updateTimeSlot, deleteTimeSlot,
    getBlockedDates, addBlockedDate, removeBlockedDate,
    checkAvailability
} = require('../controllers/timeSlotController');

// Public
router.get('/availability', checkAvailability);

// Admin
router.get('/', verifyToken, requireAdmin, getTimeSlots);
router.post('/', verifyToken, requireAdmin, createTimeSlot);
router.put('/:id', verifyToken, requireAdmin, updateTimeSlot);
router.delete('/:id', verifyToken, requireAdmin, deleteTimeSlot);

// Blocked dates
router.get('/blocked', verifyToken, requireAdmin, getBlockedDates);
router.post('/blocked', verifyToken, requireAdmin, addBlockedDate);
router.delete('/blocked/:id', verifyToken, requireAdmin, removeBlockedDate);

module.exports = router;

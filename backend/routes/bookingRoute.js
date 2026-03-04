const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin, requireAdminOrWorker } = require('../middleware/authMiddleware');
const {
    createBooking,
    trackBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    assignWorker,
    addBookingNote,
    cancelBooking,
    updateBooking,
    getBookingStats
} = require('../controllers/bookingController');

// Public routes
router.post('/', createBooking);
router.get('/track/:token', trackBooking);

// Admin routes
router.get('/stats/overview', verifyToken, requireAdmin, getBookingStats);
router.get('/', verifyToken, requireAdmin, getAllBookings);
router.get('/:id', verifyToken, requireAdminOrWorker, getBookingById);
router.put('/:id', verifyToken, requireAdmin, updateBooking);
router.put('/:id/status', verifyToken, requireAdminOrWorker, updateBookingStatus);
router.put('/:id/assign', verifyToken, requireAdmin, assignWorker);
router.post('/:id/notes', verifyToken, requireAdminOrWorker, addBookingNote);
router.put('/:id/cancel', verifyToken, requireAdmin, cancelBooking);

module.exports = router;

const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const {
    getBookingsReport,
    getRevenueReport,
    getWorkerPerformanceReport,
    getPopularServicesReport,
    exportBookingsCSV
} = require('../controllers/reportsController');

router.get('/bookings', verifyToken, requireAdmin, getBookingsReport);
router.get('/revenue', verifyToken, requireAdmin, getRevenueReport);
router.get('/workers', verifyToken, requireAdmin, getWorkerPerformanceReport);
router.get('/popular', verifyToken, requireAdmin, getPopularServicesReport);
router.get('/export/csv', verifyToken, requireAdmin, exportBookingsCSV);

module.exports = router;

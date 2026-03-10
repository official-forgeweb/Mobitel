const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const {
    getPayments,
    getPaymentStats,
    markCollected,
    initiateRefund
} = require('../controllers/paymentController');

// All routes require admin auth
router.get('/stats', verifyToken, requireAdmin, getPaymentStats);
router.get('/', verifyToken, requireAdmin, getPayments);
router.post('/mark-collected', verifyToken, requireAdmin, markCollected);
router.post('/refund', verifyToken, requireAdmin, initiateRefund);

module.exports = router;

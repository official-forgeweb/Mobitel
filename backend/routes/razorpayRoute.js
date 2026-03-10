const express = require('express');
const router = express.Router();
const {
    createOrder,
    verifyPayment,
    handleWebhook,
    getPublicPaymentSettings
} = require('../controllers/paymentController');

// Public routes — no auth required
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.post('/webhook', handleWebhook);
router.get('/payment-settings', getPublicPaymentSettings);

module.exports = router;

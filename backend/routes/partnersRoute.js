const express = require('express');
const router = express.Router();
const { getPartners, addPartner } = require('../controllers/partnersController');

router.get('/', getPartners);
router.post('/', addPartner);

module.exports = router;

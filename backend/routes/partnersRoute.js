const express = require('express');
const router = express.Router();
const { getPartners, addPartner, updatePartner } = require('../controllers/partnersController');

router.get('/', getPartners);
router.post('/', addPartner);
router.put('/:id', updatePartner);

module.exports = router;

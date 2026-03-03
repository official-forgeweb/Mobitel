const express = require('express');
const router = express.Router();
const shopsController = require('../controllers/shopsController');

router.get('/', shopsController.getShops);
router.post('/', shopsController.addShop);
router.delete('/:id', shopsController.deleteShop);

module.exports = router;

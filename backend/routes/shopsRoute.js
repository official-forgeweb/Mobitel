const express = require('express');
const router = express.Router();
const shopsController = require('../controllers/shopsController');

router.get('/', shopsController.getShops);
router.post('/', shopsController.addShop);
router.put('/:id', shopsController.updateShop);
router.delete('/:id', shopsController.deleteShop);

module.exports = router;

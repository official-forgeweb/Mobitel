const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requestsController');

router.get('/', requestsController.getRequests);
router.post('/', requestsController.addRequest);
router.put('/:id', requestsController.updateRequestStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cmsController');

router.get('/:slug?', cmsController.getCmsData);
router.put('/:slug?', cmsController.updateCmsData);

module.exports = router;

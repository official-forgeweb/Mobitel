const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin, requireWorker } = require('../middleware/authMiddleware');
const {
    workerLogin,
    getWorkers,
    createWorker,
    updateWorker,
    deleteWorker,
    getMyJobs,
    updateMyJobStatus,
    getMyJobHistory,
    updateMyProfile,
    getMyProfile,
    getWorkerStats
} = require('../controllers/workerController');

// Worker auth
router.post('/login', workerLogin);

// Admin routes
router.get('/', verifyToken, requireAdmin, getWorkers);
router.post('/', verifyToken, requireAdmin, createWorker);
router.get('/:id/stats', verifyToken, requireAdmin, getWorkerStats);
router.put('/:id', verifyToken, requireAdmin, updateWorker);
router.delete('/:id', verifyToken, requireAdmin, deleteWorker);

// Worker self-service routes
router.get('/me/profile', verifyToken, requireWorker, getMyProfile);
router.put('/me/profile', verifyToken, requireWorker, updateMyProfile);
router.get('/me/jobs', verifyToken, requireWorker, getMyJobs);
router.put('/me/jobs/:bookingId/status', verifyToken, requireWorker, updateMyJobStatus);
router.get('/me/history', verifyToken, requireWorker, getMyJobHistory);

module.exports = router;

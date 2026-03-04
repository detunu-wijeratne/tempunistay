const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests, getAllRequests, updateRequestStatus, cancelRequest } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('student'), createRequest);
router.get('/my', protect, authorize('student'), getMyRequests);
router.get('/', protect, authorize('facility', 'landlord'), getAllRequests);
router.put('/:id', protect, authorize('facility', 'landlord'), updateRequestStatus);
router.put('/:id/cancel', protect, authorize('student'), cancelRequest);

module.exports = router;

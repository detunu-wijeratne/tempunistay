const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getLandlordBookings, updateBookingStatus, cancelBooking } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('student'), createBooking);
router.get('/my', protect, authorize('student'), getMyBookings);
router.get('/landlord', protect, authorize('landlord'), getLandlordBookings);
router.put('/:id/status', protect, authorize('landlord'), updateBookingStatus);
router.put('/:id/cancel', protect, authorize('student'), cancelBooking);

module.exports = router;

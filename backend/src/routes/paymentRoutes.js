const express = require('express');
const router = express.Router();
const { getMyPayments, createPayment, updatePaymentStatus } = require('../controllers/otherControllers');
const { protect } = require('../middleware/auth');

router.get('/my', protect, getMyPayments);
router.post('/', protect, createPayment);

router.put('/:id/status', protect, updatePaymentStatus);
module.exports = router;

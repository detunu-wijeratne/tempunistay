// propertyRoutes.js
const express = require('express');
const router = express.Router();
const { getProperties, getProperty, getMyProperties, createProperty, updateProperty, deleteProperty } = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getProperties);
router.get('/my', protect, authorize('landlord'), getMyProperties);
router.get('/:id', getProperty);
router.post('/', protect, authorize('landlord'), createProperty);
router.put('/:id', protect, authorize('landlord'), updateProperty);
router.delete('/:id', protect, authorize('landlord'), deleteProperty);

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  res.json({ success: true, data: req.user });
});

// @PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, phone, university, studentId, businessName, notifications } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone, university, studentId, businessName, notifications },
      { new: true, runValidators: true, select: '-password' }
    );
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @PUT /api/users/change-password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});


// @GET /api/users/contacts?role=landlord,meal_provider,facility
// Returns users of given roles that the current user can message
router.get('/contacts', protect, async (req, res) => {
  try {
    const { role } = req.query;
    const roles = role ? role.split(',') : ['landlord', 'meal_provider', 'facility', 'student'];
    // Exclude self
    const users = await User.find({ role: { $in: roles }, _id: { $ne: req.user._id }, isActive: true })
      .select('firstName lastName email role businessName')
      .sort('firstName');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

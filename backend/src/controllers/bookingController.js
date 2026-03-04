const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @POST /api/bookings - student creates booking request
const createBooking = async (req, res) => {
  try {
    const { propertyId, startDate, endDate, message } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    if (!property.isAvailable) return res.status(400).json({ success: false, message: 'Property is not available' });

    const booking = await Booking.create({
      property: propertyId,
      tenant: req.user._id,
      landlord: property.owner,
      startDate,
      endDate,
      monthlyRent: property.price,
      message,
    });

    await booking.populate(['property', 'tenant', 'landlord']);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @GET /api/bookings/my - student's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user._id })
      .populate('property', 'title address price images')
      .populate('landlord', 'firstName lastName email')
      .sort('-createdAt');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/bookings/landlord - landlord's received bookings
const getLandlordBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ landlord: req.user._id })
      .populate('property', 'title address')
      .populate('tenant', 'firstName lastName email phone')
      .sort('-createdAt');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/bookings/:id/status - landlord approves/rejects
const updateBookingStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const booking = await Booking.findOne({ _id: req.params.id, landlord: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.status = status;
    if (notes) booking.notes = notes;

    // Update property availability when booking is approved
    if (status === 'approved') {
      await Property.findByIdAndUpdate(booking.property, { isAvailable: false });
    }
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @DELETE /api/bookings/:id - student cancels
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, tenant: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getLandlordBookings, updateBookingStatus, cancelBooking };

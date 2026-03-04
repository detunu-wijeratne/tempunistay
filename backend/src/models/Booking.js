const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    property:  { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    tenant:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    landlord:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate:   { type: Date },
    monthlyRent: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'active', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    message:   { type: String }, // message from student
    notes:     { type: String }, // notes from landlord
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);

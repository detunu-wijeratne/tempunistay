const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
  {
    student:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // facility worker
    property:   { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    type:       { type: String, enum: ['cleaning', 'laundry', 'maintenance'], required: true },
    title:      { type: String, required: true },
    description:{ type: String, required: true },
    priority:   { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status:     { type: String, enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
    scheduledFor: { type: Date },
    completedAt:  { type: Date },
    images:     [{ type: String }],
    notes:      { type: String }, // worker notes
    rating:     { type: Number, min: 1, max: 5 }, // student rating after completion
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);

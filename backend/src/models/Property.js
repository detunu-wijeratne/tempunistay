const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type:        { type: String, enum: ['studio', 'shared_house', 'apartment', 'room'], required: true },
    price:       { type: Number, required: true },
    address:     { type: String, required: true },
    distanceToCampus: { type: String },
    images:      [{ type: String }],
    amenities:   [{ type: String }], // wifi, parking, laundry, etc.
    bedrooms:    { type: Number, default: 1 },
    bathrooms:   { type: Number, default: 1 },
    maxOccupants:{ type: Number, default: 1 },
    currentOccupants: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    rating:      { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    status:      { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
  },
  { timestamps: true }
);

propertySchema.virtual('isFullyOccupied').get(function () {
  return this.currentOccupants >= this.maxOccupants;
});

module.exports = mongoose.model('Property', propertySchema);

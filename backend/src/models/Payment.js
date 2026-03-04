const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    paidBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paidTo:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount:    { type: Number, required: true },
    type:      { type: String, enum: ['rent', 'meal', 'service', 'deposit'], required: true },
    status:    { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    reference: { type: String }, // booking ID, order ID, etc.
    method:    { type: String, enum: ['card', 'bank_transfer', 'cash'], default: 'card' },
    description:{ type: String },
    dueDate:   { type: Date },
    paidAt:    { type: Date },
    slipImage: { type: String }, // base64 or URL of payment slip
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);

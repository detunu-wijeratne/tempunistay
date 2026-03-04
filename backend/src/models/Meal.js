const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  category:    { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  price:       { type: Number, required: true },
  image:       { type: String },
  isAvailable: { type: Boolean, default: true },
  calories:    { type: Number },
  isVegetarian: { type: Boolean, default: false },
});

const mealPlanSchema = new mongoose.Schema(
  {
    provider:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:        { type: String, required: true },
    description: { type: String },
    type:        { type: String, enum: ['weekly', 'monthly', 'daily'], default: 'weekly' },
    price:       { type: Number, required: true },
    image:       { type: String },
    mealsPerDay: { type: Number, default: 3 },
    isActive:    { type: Boolean, default: true },
    items:       [mealItemSchema],
  },
  { timestamps: true }
);

const mealOrderSchema = new mongoose.Schema(
  {
    student:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mealPlan:  { type: mongoose.Schema.Types.ObjectId, ref: 'MealPlan' },
    items:     [{ mealItem: String, quantity: Number, price: Number }],
    totalAmount: { type: Number, required: true },
    status:    { type: String, enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'], default: 'pending' },
    deliveryAddress: { type: String },
    scheduledFor: { type: Date },
  },
  { timestamps: true }
);

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
const MealOrder = mongoose.model('MealOrder', mealOrderSchema);

module.exports = { MealPlan, MealOrder };

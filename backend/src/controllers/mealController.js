const { MealPlan, MealOrder } = require('../models/Meal');

// ---- Meal Plans (public) ----
const getMealPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({ isActive: true }).populate('provider', 'firstName lastName');
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyMealPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({ provider: req.user._id });
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createMealPlan = async (req, res) => {
  try {
    const plan = await MealPlan.create({ ...req.body, provider: req.user._id });
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateMealPlan = async (req, res) => {
  try {
    const plan = await MealPlan.findOneAndUpdate(
      { _id: req.params.id, provider: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!plan) return res.status(404).json({ success: false, message: 'Meal plan not found' });
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteMealPlan = async (req, res) => {
  try {
    const plan = await MealPlan.findOneAndDelete({ _id: req.params.id, provider: req.user._id });
    if (!plan) return res.status(404).json({ success: false, message: 'Meal plan not found' });
    res.json({ success: true, message: 'Meal plan deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- Orders ----
const createOrder = async (req, res) => {
  try {
    const order = await MealOrder.create({ ...req.body, student: req.user._id });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await MealOrder.find({ student: req.user._id })
      .populate('provider', 'firstName lastName')
      .sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProviderOrders = async (req, res) => {
  try {
    const orders = await MealOrder.find({ provider: req.user._id })
      .populate('student', 'firstName lastName phone')
      .sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await MealOrder.findOneAndUpdate(
      { _id: req.params.id, provider: req.user._id },
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMealPlans, getMyMealPlans, createMealPlan, updateMealPlan, deleteMealPlan,
  createOrder, getMyOrders, getProviderOrders, updateOrderStatus,
};

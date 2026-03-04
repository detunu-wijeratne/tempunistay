const express = require('express');
const router = express.Router();
const {
  getMealPlans, getMyMealPlans, createMealPlan, updateMealPlan, deleteMealPlan,
  createOrder, getMyOrders, getProviderOrders, updateOrderStatus,
} = require('../controllers/mealController');
const { protect, authorize } = require('../middleware/auth');

// Plans
router.get('/plans', getMealPlans);
router.get('/plans/my', protect, authorize('meal_provider'), getMyMealPlans);
router.post('/plans', protect, authorize('meal_provider'), createMealPlan);
router.put('/plans/:id', protect, authorize('meal_provider'), updateMealPlan);
router.delete('/plans/:id', protect, authorize('meal_provider'), deleteMealPlan);

// Orders
router.post('/orders', protect, authorize('student'), createOrder);
router.get('/orders/my', protect, authorize('student'), getMyOrders);
router.get('/orders/provider', protect, authorize('meal_provider'), getProviderOrders);
router.put('/orders/:id/status', protect, authorize('meal_provider'), updateOrderStatus);

module.exports = router;

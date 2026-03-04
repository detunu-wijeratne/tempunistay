import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request - read from localStorage as fallback
api.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    const token = localStorage.getItem('unistay_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - only redirect on 401 if token actually existed (real expiry)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('unistay_token');
      if (token) {
        localStorage.removeItem('unistay_user');
        localStorage.removeItem('unistay_token');
        delete api.defaults.headers.common['Authorization'];
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const propertyAPI = {
  getAll: (params) => api.get('/properties', { params }),
  getOne: (id) => api.get(`/properties/${id}`),
  getMy: () => api.get('/properties/my'),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMy: () => api.get('/bookings/my'),
  getLandlord: () => api.get('/bookings/landlord'),
  updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
};

export const mealAPI = {
  getPlans: () => api.get('/meals/plans'),
  getMyPlans: () => api.get('/meals/plans/my'),
  createPlan: (data) => api.post('/meals/plans', data),
  updatePlan: (id, data) => api.put(`/meals/plans/${id}`, data),
  deletePlan: (id) => api.delete(`/meals/plans/${id}`),
  createOrder: (data) => api.post('/meals/orders', data),
  getMyOrders: () => api.get('/meals/orders/my'),
  getProviderOrders: () => api.get('/meals/orders/provider'),
  updateOrderStatus: (id, status) => api.put(`/meals/orders/${id}/status`, { status }),
};

export const serviceAPI = {
  create: (data) => api.post('/services', data),
  getMy: () => api.get('/services/my'),
  getAll: (params) => api.get('/services', { params }),
  update: (id, data) => api.put(`/services/${id}`, data),
  cancel: (id) => api.put(`/services/${id}/cancel`),
};

export const messageAPI = {
  send: (data) => api.post('/messages', data),
  getInbox: () => api.get('/messages/inbox'),
  getConversation: (userId) => api.get(`/messages/${userId}`),
};

export const paymentAPI = {
  getMy: () => api.get('/payments/my'),
  create: (data) => api.post('/payments', data),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  getContacts: (roles) => api.get('/users/contacts', { params: { role: roles } }),
};

export default api;

import api from './api';

export const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  createPaymentIntent: (amount) => api.post('/orders/create-payment', { amount }),
  verifyPayment: (payload) => api.post('/orders/verify-payment', payload),
  getMyOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};

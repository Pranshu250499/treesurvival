import api from './api';

export const productService = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  searchProducts: (q) => api.get('/products/search', { params: { q } }),
  createReview: (productId, reviewData) => api.post(`/products/${productId}/reviews`, reviewData),
  getReviews: (productId) => api.get(`/products/${productId}/reviews`),
  getCategories: () => api.get('/categories'),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
};

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  search: (query) => api.get(`/products?search=${query}`),
};

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  updateItem: (itemId, quantity) => api.put(`/cart/update/${itemId}?quantity=${quantity}`),
  removeItem: (itemId) => api.delete(`/cart/remove/${itemId}`),
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post(`/wishlist/add/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/wishlist/remove/${productId}`),
};

export const orderAPI = {
  placeOrder: (data) => api.post('/orders/place', data),
  getOrders: () => api.get('/orders'),
  cancelOrder: (orderId) => api.put(`/orders/${orderId}/cancel`),
};

export default api;

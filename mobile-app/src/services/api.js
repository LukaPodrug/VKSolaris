import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get API URL from environment variables
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
        // You might want to navigate to login screen here
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (username, password) => api.post('/auth/login', {username, password}),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (userData) => api.patch('/users/me', userData),
  getSeasonTickets: () => api.get('/users/season-tickets'),
  canPurchaseTicket: () => api.get('/users/can-purchase-ticket'),
};

// Stripe API
export const stripeAPI = {
  createPaymentIntent: (currency = 'usd') =>
    api.post('/stripe/create-payment-intent', {currency}),
  confirmPayment: (paymentIntentId) =>
    api.post('/stripe/confirm-payment', {paymentIntentId}),
  getPricing: () => api.get('/stripe/pricing'),
};

export default api;
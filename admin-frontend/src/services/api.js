import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  adminLogin: (username, password) =>
    api.post('/auth/admin/login', { username, password }),
};

// Admin API
export const adminAPI = {
  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },
  
  getUser: (id) => api.get(`/admin/users/${id}`),
  
  updateUserStatus: (id, status) =>
    api.patch(`/admin/users/${id}/status`, { status }),
  
  updateUserDiscount: (id, discountPercentage) =>
    api.patch(`/admin/users/${id}/discount`, { discountPercentage }),
  
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
};

export default api;
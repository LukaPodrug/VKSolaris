import axios from 'axios';

export const TOKEN_KEY = 'admin_token';
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = axios.create({ baseURL });

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Initialize auth header from stored token on first load
const stored = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
if (stored) setAuthToken(stored);

// Global 401 handler
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);



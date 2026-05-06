import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for sending/receiving cookies
});

// Request interceptor: No longer need to manually attach token from store
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config.url;
      // Only logout if it's NOT an auth/me check and NOT a subscription-related call
      // where a 401 might indicate a service error (like Stripe) rather than a session expiry.
      if (!url.includes('/auth/me') && !url.includes('/subscriptions')) {
        import('../store/useAuthStore').then(({ default: useAuthStore }) => {
          useAuthStore.getState().logout();
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
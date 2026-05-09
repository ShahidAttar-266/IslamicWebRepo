import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoaded: false,

  setAuth: (user, token) => {
    set({ user, token, isAuthenticated: true, isLoaded: true });
  },

  updateUser: (user) => set({ user }),

  logout: async () => {
    try {
      await api.get('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      set({ user: null, token: null, isAuthenticated: false, isLoaded: true });
    }
  },

  setLoaded: () => set({ isLoaded: true }),

  getToken: () => get().token,
}));

export default useAuthStore;
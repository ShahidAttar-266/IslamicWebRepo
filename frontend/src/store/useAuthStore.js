import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoaded: false, // Useful for waiting for the first 'me' check

  setAuth: (user) => set({ user, isAuthenticated: true, isLoaded: true }),
  
  updateUser: (user) => set({ user }),

  logout: async () => {
    try {
      await api.get('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      set({ user: null, isAuthenticated: false, isLoaded: true });
    }
  },
  
  setLoaded: () => set({ isLoaded: true })
}));

export default useAuthStore;
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
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
    }),
    {
      name: 'auth-storage',         // localStorage key
      partialize: (state) => ({     // only save these 3 fields, nothing else
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Mark as loaded once rehydration from localStorage is complete
        if (state) state.isLoaded = true;
      },
    }
  )
);

export default useAuthStore;
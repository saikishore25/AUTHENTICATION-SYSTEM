import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

axios.defaults.withCredentials = true;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      API_URL: import.meta.env.VITE_API_URL,
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      isCheckingAuth: true,
      message: null,
      isForgotPasswordClicked: false,
      setIsForgotPasswordClicked: (value) => set({ isForgotPasswordClicked: value }),

      signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${get().API_URL}/api/auth/signup`, { email, password, name });
          if (response.data.success) {
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
          }
        } catch (error) {
          set({
            error: error?.response?.data?.message || "Error signing up",
            isLoading: false,
          });
          throw error;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${get().API_URL}/api/auth/login`, { email, password });
          if (response.data.success) {
            set({ isAuthenticated: true, user: response.data.user, error: null, isLoading: false });
          }
        } catch (error) {
          set({
            error: error?.response?.data?.message || "Error logging in",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${get().API_URL}/api/auth/logout`);
          if (response.data.success) {
            localStorage.removeItem("auth-storage");
            set({ user: null, isAuthenticated: false, error: null, isLoading: false });
          }
        } catch (error) {
          set({ error: "Error logging out", isLoading: false });
          throw error;
        }
      },

      verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${get().API_URL}/api/auth/verify-email`, { code });
          set({ user: response.data.user, isAuthenticated: true, isLoading: false });
          return response.data;
        } catch (error) {
          set({
            error: error?.response?.data?.message || "Error verifying email",
            isLoading: false,
          });
          throw error;
        }
      },

      checkAuth: async () => {
        set({ isCheckingAuth: true });

        try {
          const response = await axios.get(`${get().API_URL}/api/auth/check-auth`, {
            withCredentials: true, // ✅ Ensures cookies are sent with the request
          });

          set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
          localStorage.setItem("auth-storage", JSON.stringify({ user: response.data.user, isAuthenticated: true }));

        } catch (error) {
          set({ user: null, isAuthenticated: false, isCheckingAuth: false });
          localStorage.removeItem("auth-storage");
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post(`${get().API_URL}/api/auth/forgot-password`, { email });
          set({ message: response.data.message, isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error?.response?.data?.message || "Error sending reset password email",
          });
          throw error;
        }
      },

      resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${get().API_URL}/api/auth/reset-password/${token}`, { password });
          set({ message: response.data.message, isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error?.response?.data?.message || "Error resetting password",
          });
          throw error;
        }
      },
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage), // Use Zustand's JSON storage wrapper
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // Persist only required fields
    }
  )
);

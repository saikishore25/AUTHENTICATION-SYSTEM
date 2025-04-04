import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";



axios.defaults.withCredentials = true;

export const useAuthStore = create(
  persist(
    (set) => ({
      API_URL: import.meta.env.VITE_API_URL,
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      isCheckingAuth: true,
      message: null,
	  isForgotPasswordClicked:false,
	  setIsForgotPasswordClicked: (value) => set({ isForgotPasswordClicked: value }),
	  

      signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/signup`, { email, password, name });
          if (response.data.success) {
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
          }
        } catch (error) {
          set({ error: error.response.data.message || "Error signing up", isLoading: false });
          throw error;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/login`, { email, password });
          if (response.data.success) {
            set({ isAuthenticated: true, user: response.data.user, error: null, isLoading: false });
          }
        } catch (error) {
          set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/logout`);
          if (response.data.success) {
            set({ user: null, isAuthenticated: false, error: null, isLoading: false });
            localStorage.removeItem("auth-storage"); // Remove only auth-related state
          }
        } catch (error) {
          set({ error: "Error logging out", isLoading: false });
          throw error;
        }
      },
	  verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/verify-email`, { code });
          set({ user: response.data.user, isAuthenticated: true, isLoading: false });
          return response.data;
        } catch (error) {
          set({ error: error.response.data.message || "Error verifying email", isLoading: false });
          throw error;
        }
      },


      checkAuth: async () => {
        set({ isCheckingAuth: true });
    
        try {
            // Fetch user data from the backend
            const response = await axios.get(`${API_URL}/check-auth`, {
                withCredentials: true, // ✅ Ensures cookies are sent with the request
            });
    
            console.log("User authenticated:", response.data.user);
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
    
            // ✅ Store updated auth state in localStorage (optional)
            localStorage.setItem("auth-storage", JSON.stringify({ state: { user: response.data.user, isAuthenticated: true } }));
    
        }
        
        catch (error) {
            console.error("Authentication check failed:", error);
            set({ user: null, isAuthenticated: false, isCheckingAuth: false });
            localStorage.removeItem("auth-storage"); // ✅ Remove outdated auth state
        }
    },
    

	

      forgotPassword: async (email) => {
        
        set({ isLoading: true, error: null });
            
        try{
              const response = await axios.post(`${API_URL}/forgot-password`, { email });
              set({ message: response.data.message, isLoading: false });
            } 
        
        catch(error){

              set({
                isLoading: false,
                error: error.response.data.message || "Error sending reset password email",
              });

              throw error;
        }
      },

      resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
          set({ message: response.data.message, isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error.response.data.message || "Error resetting password",
          });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage), // Use Zustand's JSON storage wrapper
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }), // Persist only required fields
    }
  )
);

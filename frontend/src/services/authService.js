import api from "../api/axios";

const API_URL = "http://127.0.0.1:8000";

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      // backend expects JSON body: {name,email,password,role,department?}
      const response = await api.post("/auth/register", userData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Register Error:", error);
      throw error;
    }
  },


  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  },

  getCurrentUser: () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    return token && role ? { token, role } : null;
  },

  verifyToken: async (token) => {
    try {
      const response = await api.post("/auth/verify", { token });
      return response.data;
    } catch (error) {
      console.error("Token Verification Error:", error);
      return null;
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post("/auth/refresh");
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
      }
      return response.data;
    } catch (error) {
      console.error("Token Refresh Error:", error);
      return null;
    }
  },
};

// Keep the loginUser export for backward compatibility
export const loginUser = authService.login;
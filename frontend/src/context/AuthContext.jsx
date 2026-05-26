import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    // Initialize auth from localStorage
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (savedToken && savedRole) {
      setToken(savedToken);
      setUser({
        role: savedRole,
        token: savedToken,
      });
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);

      if (response.data.access_token) {
        const token = response.data.access_token;
        const payload = JSON.parse(atob(token.split(".")[1]));

        localStorage.setItem("token", token);
        localStorage.setItem("role", payload.role || "");

        setToken(token);
        setUser({
          role: payload.role || "",
          token: token,
          ...payload,
        });

        return { success: true };
      }

      return { success: false, error: response.data.error || "Login failed" };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

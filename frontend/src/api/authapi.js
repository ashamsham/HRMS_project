import api from "./axios";

export const loginUser = async (loginData) => {
  try {
    const response = await api.post("/auth/login", loginData);
    return response.data;
  } catch (error) {
    return {
      error:
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.message ||
        "Login failed"
    };
  }
};
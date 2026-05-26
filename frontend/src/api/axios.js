import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Add authorization token to requests
api.interceptors.request.use((config) => {
  // Backend expects: Authorization: Bearer <jwt>
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

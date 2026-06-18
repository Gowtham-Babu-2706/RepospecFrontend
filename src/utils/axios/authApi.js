import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:8080/auth",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically to every outgoing request
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — clear stale token
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default authApi;

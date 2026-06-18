import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:8080/api/v1/repos",
    timeout:20000,
    headers:{
        "Content-Type":"application/json",
    }
});

// Attach JWT token automatically to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
import axios from "axios";

const api = axios.create({
    baseURL:"https://repospecbackend-1.onrender.com/api/v1/repos",
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
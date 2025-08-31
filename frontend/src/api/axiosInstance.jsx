import axios from "axios";

// Choose backend URL based on environment
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://inventory-telecom-management.onrender.com/api"
    : "http://localhost:5000/api";

const axiosInstance = axios.create({ baseURL });

// ✅ Always attach latest token from localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;

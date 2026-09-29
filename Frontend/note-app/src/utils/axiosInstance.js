import axios from "axios";

// Automatically use environment variable or fallback to production Render backend
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://notepadbyunli.onrender.com";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for secure HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor: attach Authorization header if a token is in localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token expirations gracefully
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/signup" && currentPath !== "/") {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from "axios";

// Automatically use environment variable or fallback to production Render backend
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://notepadbyunli.onrender.com";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Supports cookies on browsers that allow them
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Dual authentication: attach Bearer token from localStorage for iOS Safari / WebKit
// (iOS Safari blocks cross-site cookies by default via ITP)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
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
      if (
        currentPath !== "/login" &&
        currentPath !== "/signup" &&
        currentPath !== "/" &&
        currentPath !== "/forgot-password" &&
        !currentPath.startsWith("/reset-password")
      ) {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

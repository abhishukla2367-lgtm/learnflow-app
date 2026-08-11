import axios from "axios";

// Helper to guarantee the URL always ends with '/api'.
// In production (no VITE_API_URL set), fall back to a relative path so
// requests go to the same origin the frontend is served from — avoids
// hardcoding localhost, which breaks in any deployed environment.
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return "/api";
  const cleanUrl = envUrl.replace(/\/+$/, "");
  return cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lf_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Handle 401 Unauthorized (prevent infinite redirect loops if already on login screen)
    if (status === 401) {
      localStorage.removeItem("lf_user");
      localStorage.removeItem("lf_token");

      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
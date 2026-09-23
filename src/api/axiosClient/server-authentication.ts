import axios from "axios";

// Base URL can come from an env var so it's easy to swap between
// local dev, staging, and production without touching this file.
const BASE_URL = import.meta.env.VITE_API_UNFIYNET_AUTHENTICATION_BASE_URL ?? "http://localhost:3000";

const axiosClientAuthentication = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Optional: centralize request/response handling here so every
// call site benefits automatically (e.g. attaching auth tokens,
// logging, or redirecting on 401).
axiosClientAuthentication.interceptors.request.use((config) => {
  // const token = localStorage.getItem("token");
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClientAuthentication.interceptors.response.use(
  (response) => response,
  (error) => {
    // Central place to log/report errors if you want.
    return Promise.reject(error);
  }
);

export default axiosClientAuthentication;
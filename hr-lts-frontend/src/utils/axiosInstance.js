import axios from "axios";
import API_BASE from "./api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

let _refreshAccessToken = null;
let _logout = null;

export const registerAuthCallbacks = (refreshFn, logoutFn) => {
  _refreshAccessToken = refreshFn;
  _logout = logoutFn;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/refresh")
    ) {
      originalRequest._retry = true;
      if (_refreshAccessToken) {
        const newToken = await _refreshAccessToken();
        if (newToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          setAuthToken(newToken);
          return axiosInstance(originalRequest);
        }
      }
      if (_logout) _logout();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

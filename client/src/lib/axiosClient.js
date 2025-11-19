// client/src/lib/axiosClient.js
import axios from 'axios';
import { API_URL } from './api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false, // set true only if you use cookie-based auth
});

// Add Authorization header from localStorage (if token exists)
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore
  }
  return config;
}, (err) => Promise.reject(err));

// Optional: global response interceptor to catch 401s (could refresh token here)
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default api;

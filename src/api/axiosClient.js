import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080/api/v1';

// Constantes exportadas para compatibilidad con vistas legacy
export const AUTH_URL = `${BASE_URL}/auth`;
export const CATALOG_URL = `${BASE_URL}/catalog/products`;
export const ORDER_URL = `${BASE_URL}/orders`;
export const AUDIT_URL = `${BASE_URL}/audit-logs`;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
import axios from 'axios';

export const AUTH_URL = 'http://localhost:8081/api/v1/auth';
export const CATALOG_URL = 'http://localhost:8082/api/v1/products';
export const ORDER_URL = 'http://localhost:8083/api/v1/orders';
export const AUDIT_URL = 'http://localhost:8084/api/v1/audit-logs';

const axiosClient = axios.create();

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default axiosClient;
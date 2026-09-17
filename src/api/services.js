import axiosClient from './axiosClient';

// Auth
export const loginApi = async (credentials) => {
  const response = await axiosClient.post('/auth/login', credentials);
  return response.data;
};

// Catálogo y Proveedores
export const getSuppliers = () => axiosClient.get('/catalog/suppliers').then(r => r.data);
export const createSupplier = (data) => axiosClient.post('/catalog/suppliers', data).then(r => r.data);
export const getProducts = () => axiosClient.get('/catalog/products').then(r => r.data);

// Órdenes
export const getOrders = () => axiosClient.get('/orders').then(r => r.data);
export const createOrder = (data) => axiosClient.post('/orders', data).then(r => r.data);

// Auditoría
export const getAuditLogs = () => axiosClient.get('/audit-logs').then(r => r.data);
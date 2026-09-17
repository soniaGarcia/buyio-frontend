import axiosClient from './axiosClient';

// --- MÓDULO DE AUTENTICACIÓN ---
export const loginApi = (credentials) => 
  axiosClient.post('/auth/login', credentials).then((r) => r.data);

export const registerApi = (data) => 
  axiosClient.post('/auth/register', data).then((r) => r.data);

// --- MÓDULO DE ÓRDENES ---
export const getOrders = () => 
  axiosClient.get('/orders').then((r) => r.data);

export const createOrder = (data) => 
  axiosClient.post('/orders', data).then((r) => r.data);

export const updateOrderStatus = (id, status) =>
  axiosClient.patch(`/orders/${id}/status`, null, { params: { status } }).then((r) => r.data);

// --- MÓDULO DE CATÁLOGO Y PROVEEDORES ---
export const getSuppliers = () => 
  axiosClient.get('/catalog/suppliers').then((r) => r.data);

export const createSupplier = (data) => 
  axiosClient.post('/catalog/suppliers', data).then((r) => r.data);

export const getProducts = () => 
  axiosClient.get('/catalog/products').then((r) => r.data);

export const createProduct = (data) => 
  axiosClient.post('/catalog/products', data).then((r) => r.data);

export const updateProductPrice = (id, price) => 
  axiosClient.post(`/catalog/products/${id}/prices`, price).then((r) => r.data);

// --- MÓDULO DE AUDITORÍA ---
export const getAuditLogs = () => 
  axiosClient.get('/audit-logs').then((r) => r.data);
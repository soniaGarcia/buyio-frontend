import axiosClient from './axiosClient';

// Autenticación
export const loginApi = (credentials) => 
  axiosClient.post('/auth/login', credentials).then((r) => r.data);

export const registerApi = (data) => 
  axiosClient.post('/auth/register', data).then((r) => r.data);

// Órdenes de Compra (Sincronizado con PurchaseOrderController.java)
export const getOrders = () => 
  axiosClient.get('/orders').then((r) => r.data);

export const createOrder = (data) => 
  axiosClient.post('/orders', data).then((r) => r.data);

// Cambia el estado consumiendo PATCH /api/v1/orders/{id}/status?status={status}
export const updateOrderStatus = (uuid, status) =>
  axiosClient.patch(`/orders/${uuid}/status`, null, { params: { status } }).then((r) => r.data);

// Catálogo, Categorías y Proveedores
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

// Bitácora de Auditoría
export const getAuditLogs = () => 
  axiosClient.get('/audit-logs').then((r) => r.data);

// Categorías
export const getCategories = (activeOnly = false) => 
  axiosClient.get(`/catalog/categories?activeOnly=${activeOnly}`).then(r => r.data);

export const createCategory = (data) => 
  axiosClient.post('/catalog/categories', data).then(r => r.data);

export const updateCategoryStatus = (id, active) => 
  axiosClient.patch(`/catalog/categories/${id}/status?active=${active}`).then(r => r.data);

//PRODUCTOS & HISTORIAL (Corregido con prefijo /catalog)
export const updateProductStatus = (id, status) => 
  axiosClient.patch(`/catalog/products/${id}/status?status=${status}`).then(r => r.data);

export const getPriceHistory = (productId) => 
  axiosClient.get(`/catalog/products/${productId}/prices`).then(r => r.data);
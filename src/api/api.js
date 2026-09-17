import axiosClient, { CATALOG_URL, ORDER_URL, AUDIT_URL } from './axiosClient';

// Desacoplamiento total de URLs duras
export const getSuppliers = () => axiosClient.get(`${CATALOG_URL}/suppliers`).then(r => r.data);
export const createSupplier = (data) => axiosClient.post(`${CATALOG_URL}/suppliers`, data).then(r => r.data);

export const getProducts = () => axiosClient.get(`${CATALOG_URL}/products`).then(r => r.data);
export const createProduct = (data) => axiosClient.post(`${CATALOG_URL}/products`, data).then(r => r.data);
export const updateProductPrice = (id, price) => 
  axiosClient.post(`${CATALOG_URL}/products/${id}/prices`, price);

export const getOrders = () => axiosClient.get(ORDER_URL).then(r => r.data);
export const createOrder = (data) => axiosClient.post(ORDER_URL, data).then(r => r.data);
export const updateOrderStatus = (id, status) => 
  axiosClient.patch(`${ORDER_URL}/${id}/status`, null, { params: { status } }).then(r => r.data);

export const getAuditLogs = () => axiosClient.get(AUDIT_URL).then(r => r.data);
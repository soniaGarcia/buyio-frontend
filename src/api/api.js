import axiosClient, { CATALOG_URL, ORDER_URL } from './axiosClient';

// CATÁLOGOS (catalog-service:8082)
export async function getSuppliers() {
    const response = await axiosClient.get(`${CATALOG_URL}/suppliers`);
    return response.data;
}

export async function createSupplier(data) {
    const response = await axiosClient.post(`${CATALOG_URL}/suppliers`, data);
    return response.data;
}

export async function getProducts() {
    const response = await axiosClient.get(`${CATALOG_URL}/products`);
    return response.data;
}

export async function createProduct(data) {
    const response = await axiosClient.post(`${CATALOG_URL}/products`, data);
    return response.data;
}

// ÓRDENES (order-service:8083)
export async function getOrders() {
    const response = await axiosClient.get(ORDER_URL);
    return response.data;
}

export async function createOrder(data) {
    const response = await axiosClient.post(ORDER_URL, data);
    return response.data;
}

export async function updateOrderStatus(orderId, status) {
    const response = await axiosClient.patch(`${ORDER_URL}/${orderId}/status`, null, {
        params: { status }
    });
    return response.data;
}
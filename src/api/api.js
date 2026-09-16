const API_CATALOG = 'http://localhost:8082/api/v1';
const API_ORDERS = 'http://localhost:8083/api/v1';

function getAuthHeader() {
    const token = localStorage.getItem('token');
    return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export async function getSuppliers() {
    const res = await fetch(`${API_CATALOG}/suppliers`, { headers: getAuthHeader() });
    return res.json();
}

export async function createSupplier(data) {
    const res = await fetch(`${API_CATALOG}/suppliers`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function getProducts() {
    const res = await fetch(`${API_CATALOG}/products`, { headers: getAuthHeader() });
    return res.json();
}

export async function createProduct(data) {
    const res = await fetch(`${API_CATALOG}/products`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function getOrders() {
    const res = await fetch(`${API_ORDERS}/orders`, { headers: getAuthHeader() });
    return res.json();
}

export async function createOrder(data) {
    const res = await fetch(`${API_ORDERS}/orders`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function updateOrderStatus(orderId, status) {
    const res = await fetch(`${API_ORDERS}/orders/${orderId}/status?status=${status}`, {
        method: 'PATCH',
        headers: getAuthHeader()
    });
    return res.json();
}
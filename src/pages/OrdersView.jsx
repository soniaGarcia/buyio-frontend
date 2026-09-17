import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../api/api';

export function OrdersView({ onOpenCreateModal }) {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [loading, setLoading] = useState(true);

    const loadOrders = () => {
        setLoading(true);
        getOrders()
            .then((data) => setOrders(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Error al cargar órdenes:", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadOrders(); }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateOrderStatus(id, newStatus);
            loadOrders();
        } catch (err) {
            alert('Error al actualizar el estado de la orden');
        }
    };

    const filteredOrders = filterStatus === 'ALL' 
        ? orders 
        : orders.filter(o => o.status === filterStatus);

    if (loading) return <div style={{ padding: '20px' }}>Cargando órdenes...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Bandeja de Órdenes de Compra</h2>
            {onOpenCreateModal && (
                <button onClick={onOpenCreateModal} style={{ marginBottom: '15px' }}>
                    + Nueva Orden de Compra
                </button>
            )}
            
            <label style={{ marginLeft: '20px' }}>Filtrar Estado: </label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="ALL">Todos</option>
                <option value="INGRESADO">INGRESADO</option>
                <option value="SOLICITADO">SOLICITADO</option>
                <option value="RECIBIDA">RECIBIDA</option>
                <option value="ANULADA">ANULADA</option>
            </select>

            <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th>N° Orden</th>
                        <th>Fecha Ingreso</th>
                        <th>Fecha Disponibilidad</th>
                        <th>Total ($)</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                No se encontraron órdenes registrada(s).
                            </td>
                        </tr>
                    ) : (
                        filteredOrders.map(o => (
                            <tr key={o.id}>
                                <td>{o.orderNumber}</td>
                                <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}</td>
                                <td>{o.expectedDeliveryDate}</td>
                                <td>${typeof o.totalAmount === 'number' ? o.totalAmount.toFixed(2) : '0.00'}</td>
                                <td><strong>{o.status}</strong></td>
                                <td>
                                    {o.status === 'INGRESADO' && (
                                        <button onClick={() => handleStatusChange(o.id, 'SOLICITADO')}>Solicitar</button>
                                    )}
                                    {o.status === 'SOLICITADO' && (
                                        <button onClick={() => handleStatusChange(o.id, 'RECIBIDA')}>Marcar Recibida</button>
                                    )}
                                    {o.status !== 'ANULADA' && o.status !== 'RECIBIDA' && (
                                        <button onClick={() => handleStatusChange(o.id, 'ANULADA')} style={{ color: 'red', marginLeft: '5px' }}>Anular</button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
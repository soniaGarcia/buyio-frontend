import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from './api';

export function OrdersView({ onOpenCreateModal }) {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('ALL');

    const loadOrders = () => getOrders().then(setOrders);

    useEffect(() => { loadOrders(); }, []);

    const handleStatusChange = async (id, newStatus) => {
        await updateOrderStatus(id, newStatus);
        loadOrders();
    };

    const filteredOrders = filterStatus === 'ALL' 
        ? orders 
        : orders.filter(o => o.status === filterStatus);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Bandeja de Órdenes de Compra</h2>
            <button onClick={onOpenCreateModal} style={{ marginBottom: '15px' }}>+ Nueva Orden de Compra</button>
            
            <label style={{ marginLeft: '20px' }}>Filtrar Estado: </label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="ALL">Todos</option>
                <option value="INGRESADO">INGRESADO</option>
                <option value="SOLICITADO">SOLICITADO</option>
                <option value="RECIBIDA">RECIBIDA</option>
                <option value="ANULADA">ANULADA</option>
            </select>

            <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th>N° Orden</th>
                        <th>Fecha Ingreso</th>
                        <th>Fecha Disponibilidad</th>
                        <th>Total ($)</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map(o => (
                        <tr key={o.id}>
                            <td>{o.orderNumber}</td>
                            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                            <td>{o.expectedDeliveryDate}</td>
                            <td>${o.totalAmount.toFixed(2)}</td>
                            <td><strong>{o.status}</strong></td>
                            <td>
                                {o.status === 'INGRESADO' && (
                                    <button onClick={() => handleStatusChange(o.id, 'SOLICITADO')}>Solicitar</button>
                                )}
                                {o.status === 'SOLICITADO' && (
                                    <button onClick={() => handleStatusChange(o.id, 'RECIBIDA')}>Marcar Recibida</button>
                                )}
                                {o.status !== 'ANULADA' && o.status !== 'RECIBIDA' && (
                                    <button onClick={() => handleStatusChange(o.id, 'ANULADA')} style={{ color: 'red' }}>Anular</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
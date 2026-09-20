import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../api/api';
import { CreateOrderModal } from './CreateOrderModal';

export function OrdersView() {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadOrders = () => {
        setLoading(true);
        getOrders()
            .then((data) => setOrders(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Error al obtener las órdenes:", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadOrders(); }, []);

    const handleStatusChange = async (uuid, newStatus) => {
        if (newStatus === 'ANULADA' && !window.confirm('¿Desea anular esta orden de compra?')) {
            return;
        }
        try {
            await updateOrderStatus(uuid, newStatus);
            loadOrders();
        } catch (err) {
            alert(`Error al cambiar el estado a ${newStatus}`);
        }
    };

    const handleOpenCreate = () => {
        setSelectedOrder(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const filteredOrders = filterStatus === 'ALL' 
        ? orders 
        : orders.filter(o => o.status === filterStatus);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'INGRESADO':
                return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-xs font-extrabold px-2.5 py-1 rounded-full">INGRESADO</span>;
            case 'SOLICITADO':
                return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-extrabold px-2.5 py-1 rounded-full">SOLICITADO</span>;
            case 'RECIBIDA':
                return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold px-2.5 py-1 rounded-full">RECIBIDA</span>;
            case 'ANULADA':
                return <span className="bg-red-100 text-red-800 border border-red-300 text-xs font-extrabold px-2.5 py-1 rounded-full">ANULADA</span>;
            default:
                return <span className="bg-slate-100 text-slate-800 border border-slate-300 text-xs font-extrabold px-2.5 py-1 rounded-full">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#003876]">Bandeja de Órdenes de Compra</h1>
                    <p className="text-xs text-slate-500 mt-1">Control de ciclo de vida: INGRESADO ➔ SOLICITADO ➔ RECIBIDA / ANULADA.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
                >
                    <span className="text-lg leading-none">+</span> Nueva Orden
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                <label className="text-xs font-bold uppercase text-slate-600">Filtrar por Estado:</label>
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="p-2 border border-slate-300 rounded-md text-xs font-medium text-slate-700 bg-slate-50 outline-none"
                >
                    <option value="ALL">Todos los Estados (4)</option>
                    <option value="INGRESADO">INGRESADO</option>
                    <option value="SOLICITADO">SOLICITADO</option>
                    <option value="RECIBIDA">RECIBIDA</option>
                    <option value="ANULADA">ANULADA</option>
                </select>
                <span className="text-xs text-slate-400 ml-auto">Mostrando {filteredOrders.length} orden(es)</span>
            </div>

            {/* Tabla de Órdenes */}
            <div className="bg-white shadow-md rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#003876] text-white text-xs uppercase tracking-wider">
                                <th className="p-4">N° Orden</th>
                                <th className="p-4">Fecha Creación</th>
                                <th className="p-4">Fecha Ingreso Requerida</th>
                                <th className="p-4 text-right">Total ($)</th>
                                <th className="p-4 text-center">Estado</th>
                                <th className="p-4 text-center">Gestión de Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-slate-500">Cargando órdenes...</td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-slate-400">No hay órdenes para el filtro seleccionado.</td>
                                </tr>
                            ) : (
                                filteredOrders.map(o => (
                                    <tr key={o.id} className="hover:bg-slate-50 transition">
                                        <td className="p-4 font-mono font-bold text-blue-900 text-xs" title={`UUID: ${o.id}`}>
                                            {o.orderNumber || (o.id ? `${o.id.substring(0, 8)}...` : 'N/A')}
                                        </td>
                                        <td className="p-4 text-xs text-slate-600">
                                            {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-4 text-xs font-semibold text-slate-700">
                                            {o.expectedDeliveryDate || 'N/A'}
                                        </td>
                                        <td className="p-4 text-right font-black text-slate-800">
                                            ${typeof o.totalAmount === 'number' ? o.totalAmount.toFixed(2) : '0.00'}
                                        </td>
                                        <td className="p-4 text-center">
                                            {getStatusBadge(o.status)}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center items-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(o)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-2.5 py-1 rounded shadow-sm"
                                                >
                                                    👁️ Detalle
                                                </button>

                                                {o.status === 'INGRESADO' && (
                                                    <button
                                                        onClick={() => handleStatusChange(o.id, 'SOLICITADO')}
                                                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-2.5 py-1 rounded shadow-sm"
                                                    >
                                                        📤 Solicitar
                                                    </button>
                                                )}

                                                {o.status === 'SOLICITADO' && (
                                                    <button
                                                        onClick={() => handleStatusChange(o.id, 'RECIBIDA')}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1 rounded shadow-sm"
                                                    >
                                                        ✓ Recibir
                                                    </button>
                                                )}

                                                {(o.status === 'INGRESADO' || o.status === 'SOLICITADO') && (
                                                    <button
                                                        onClick={() => handleStatusChange(o.id, 'ANULADA')}
                                                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-2.5 py-1 rounded shadow-sm"
                                                    >
                                                        🚫 Anular
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <CreateOrderModal
                    orderToEdit={selectedOrder}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={loadOrders}
                />
            )}
        </div>
    );
}
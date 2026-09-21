import React, { useState, useEffect } from 'react';
import { getSuppliers, getProducts, createOrder, updateOrderStatus } from '../api/api';

export function CreateOrderModal({ orderToEdit, onClose, onSuccess }) {
    // Fecha actual en formato YYYY-MM-DD para restricción del calendario y validación
    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayStr = getTodayString();

    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [supplierId, setSupplierId] = useState('');
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(todayStr);
    const [items, setItems] = useState([
        { productId: '', quantity: 1, unitPrice: 0 }
    ]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isEditMode = Boolean(orderToEdit);
    const isReadOnly = isEditMode; // La orden creada es de lectura en este modal (excepto cambio de estado)

    useEffect(() => {
        // Cargar catálogo de proveedores y productos desde las APIs
        Promise.all([getSuppliers(), getProducts()])
            .then(([suppliersData, productsData]) => {
                setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
                setProducts(Array.isArray(productsData) ? productsData : []);
            })
            .catch(() => setError('Error al cargar el catálogo de referencia.'));

        if (orderToEdit) {
            setSupplierId(orderToEdit.supplierId || '');
            setExpectedDeliveryDate(orderToEdit.expectedDeliveryDate || todayStr);
            if (Array.isArray(orderToEdit.items) && orderToEdit.items.length > 0) {
                setItems(orderToEdit.items.map(i => ({
                    productId: i.productId,
                    quantity: i.quantity,
                    unitPrice: i.unitPrice
                })));
            } else {
                setItems([]);
            }
        } else {
            setSupplierId('');
            setExpectedDeliveryDate(todayStr);
            setItems([{ productId: '', quantity: 1, unitPrice: 0 }]);
        }
        setError('');
    }, [orderToEdit]);

    const addItem = () => {
        setItems([...items, { productId: '', quantity: 1, unitPrice: 0 }]);
    };

    const removeItem = (index) => {
        if (items.length === 1 && !isReadOnly) {
            setError('La orden debe incluir al menos un producto.');
            return;
        }
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        if (field === 'productId') {
            newItems[index].productId = value;
            const prod = products.find(p => p.id === value);
            if (prod) {
                newItems[index].unitPrice = prod.currentPrice ?? prod.price ?? 0;
            }
        } else if (field === 'quantity') {
            const parsed = parseInt(value, 10);
            newItems[index].quantity = isNaN(parsed) ? '' : parsed;
        } else {
            newItems[index][field] = value;
        }
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + ((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)), 0).toFixed(2);
    };

    const validateForm = () => {
        if (!supplierId) {
            setError('Debe seleccionar un proveedor.');
            return false;
        }

        if (!expectedDeliveryDate || expectedDeliveryDate < todayStr) {
            setError('La fecha estimada de entrega debe ser la fecha actual o una fecha futura.');
            return false;
        }

        if (items.length === 0) {
            setError('Debe incluir al menos un producto en la orden.');
            return false;
        }

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item.productId) {
                setError(`Debe seleccionar un producto en la línea ${i + 1}.`);
                return false;
            }
            const qty = parseInt(item.quantity, 10);
            if (isNaN(qty) || qty < 1) {
                setError(`La cantidad en la línea ${i + 1} debe ser un número entero mayor a 0.`);
                return false;
            }
            if (parseFloat(item.unitPrice) <= 0) {
                setError(`El precio unitario en la línea ${i + 1} debe ser mayor a 0.`);
                return false;
            }
        }

        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                supplierId,
                expectedDeliveryDate,
                items: items.map(i => ({
                    productId: i.productId,
                    quantity: parseInt(i.quantity, 10),
                    unitPrice: parseFloat(i.unitPrice)
                }))
            };

            await createOrder(payload);
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Error al procesar la orden de compra.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusTransition = async (targetStatus) => {
        if (!orderToEdit?.id) return;
        setLoading(true);
        try {
            await updateOrderStatus(orderToEdit.id, targetStatus);
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (err) {
            setError(`No se pudo cambiar el estado a ${targetStatus}.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8">
                {/* Header del Modal */}
                <div className="bg-[#003876] text-white px-6 py-4 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <span>📦</span>
                            {isEditMode ? `Detalle de Orden (UUID: ${orderToEdit.id?.substring(0, 8)}...)` : 'Nueva Orden de Compra'}
                        </h3>
                        <p className="text-xs text-blue-200 mt-0.5">
                            {isEditMode ? `Estado actual: ${orderToEdit.status}` : 'Estado inicial al guardar: INGRESADO'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-300 hover:text-white text-2xl font-bold">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Proveedor Requerido</label>
                            <select
                                value={supplierId}
                                onChange={e => setSupplierId(e.target.value)}
                                disabled={isReadOnly}
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 disabled:bg-slate-100 outline-none focus:ring-2 focus:ring-blue-600"
                                required
                            >
                                <option value="">-- Seleccionar Proveedor --</option>
                                {suppliers.map(s => (
                                    <option key={s.id} value={s.id}>{s.name || s.companyName} ({s.taxId || s.tax_id || 'Sin NIT'})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Fecha Ingreso Requerida</label>
                            <input
                                type="date"
                                value={expectedDeliveryDate}
                                min={todayStr}
                                onChange={e => setExpectedDeliveryDate(e.target.value)}
                                disabled={isReadOnly}
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 disabled:bg-slate-100 outline-none focus:ring-2 focus:ring-blue-600"
                                required
                            />
                        </div>
                    </div>

                    {/* Partidas de Productos */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-slate-800 text-sm uppercase">Partidas de Productos</h4>
                            {!isReadOnly && (
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow"
                                >
                                    + Agregar Producto
                                </button>
                            )}
                        </div>

                        {items.length === 0 ? (
                            <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
                                No hay partidas asociadas.
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                        <div className="flex-1">
                                            <select
                                                value={item.productId}
                                                onChange={e => updateItem(index, 'productId', e.target.value)}
                                                disabled={isReadOnly}
                                                className="w-full p-2 border border-slate-300 rounded text-xs disabled:bg-slate-100 outline-none"
                                                required
                                            >
                                                <option value="">Seleccione Producto...</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name} ({p.sku || 'SKU N/A'})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-24">
                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={item.quantity}
                                                onKeyDown={(e) => {
                                                    if (['.', 'e', 'E', '+', '-'].includes(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={e => updateItem(index, 'quantity', e.target.value)}
                                                disabled={isReadOnly}
                                                className="w-full p-2 border border-slate-300 rounded text-xs text-center disabled:bg-slate-100 outline-none"
                                                required
                                            />
                                        </div>
                                        <div className="w-28 text-right font-mono text-xs text-slate-700">
                                            ${(parseFloat(item.unitPrice) || 0).toFixed(2)}
                                        </div>
                                        <div className="w-28 text-right font-bold font-mono text-xs text-blue-900">
                                            ${((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)).toFixed(2)}
                                        </div>
                                        {!isReadOnly && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-red-500 hover:text-red-700 font-bold px-2 text-sm"
                                                title="Eliminar partida"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Resumen */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                        <span className="text-xs text-slate-500 font-bold uppercase">Monto Total Calculado</span>
                        <span className="text-2xl font-black text-blue-900">${calculateTotal()}</span>
                    </div>

                    {/* Acciones del Modal */}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                        <div className="flex gap-2">
                            {isEditMode && orderToEdit.status === 'INGRESADO' && (
                                <button
                                    type="button"
                                    onClick={() => handleStatusTransition('SOLICITADO')}
                                    disabled={loading}
                                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded shadow transition"
                                >
                                    📤 Pasar a SOLICITADO
                                </button>
                            )}

                            {isEditMode && orderToEdit.status === 'SOLICITADO' && (
                                <button
                                    type="button"
                                    onClick={() => handleStatusTransition('RECIBIDA')}
                                    disabled={loading}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded shadow transition"
                                >
                                    ✓ Marcar como RECIBIDA
                                </button>
                            )}

                            {isEditMode && (orderToEdit.status === 'INGRESADO' || orderToEdit.status === 'SOLICITADO') && (
                                <button
                                    type="button"
                                    onClick={() => handleStatusTransition('ANULADA')}
                                    disabled={loading}
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded shadow transition"
                                >
                                    🚫 Anular Orden
                                </button>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded transition"
                            >
                                Cerrar
                            </button>
                            {!isReadOnly && (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-5 py-2 rounded shadow transition disabled:opacity-50"
                                >
                                    {loading ? 'Procesando...' : 'Guardar Orden (INGRESADO)'}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
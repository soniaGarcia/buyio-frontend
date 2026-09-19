import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, getSuppliers, updateProductPrice, getCategories, updateProductStatus, getPriceHistory } from '../api/api';

export function ProductsView() {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // Formulario de Producto
    const [sku, setSku] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal de Historial de Precios
    const [selectedProductForHistory, setSelectedProductForHistory] = useState(null);
    const [priceHistoryList, setPriceHistoryList] = useState([]);

    const loadData = () => {
        getProducts().then(data => setProducts(Array.isArray(data) ? data : [])).catch(console.error);
        getSuppliers().then(data => setSuppliers(Array.isArray(data) ? data : [])).catch(console.error);
        getCategories(true).then(data => setCategories(Array.isArray(data) ? data : [])).catch(console.error);
    };

    useEffect(() => { loadData(); }, []);

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await createProduct({
                sku, name, description, categoryId, supplierId,
                price: parseFloat(price)
            });
            setSku(''); setName(''); setDescription(''); setCategoryId(''); setSupplierId(''); setPrice('');
            setSuccess('Producto registrado como ACTIVO correctamente.');
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear el producto.');
        }
    };

    const handleUpdatePrice = async (productId) => {
        const newPrice = prompt('Ingrese el nuevo precio activo para este producto (USD):');
        if (!newPrice || isNaN(newPrice) || parseFloat(newPrice) <= 0) return;

        try {
            await updateProductPrice(productId, { unitPrice: parseFloat(newPrice), currency: 'USD' });
            loadData();
        } catch (err) {
            alert('Error al actualizar el precio.');
        }
    };

    const handleToggleStatus = async (product) => {
        setError(''); setSuccess('');
        const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            await updateProductStatus(product.id, newStatus);
            setSuccess(`Producto ${product.sku} cambiado a estado ${newStatus}.`);
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudo cambiar el estado del producto.');
        }
    };

    const handleOpenHistory = async (product) => {
        try {
            const history = await getPriceHistory(product.id);
            // Normalización defensiva de datos
            const safeList = Array.isArray(history) ? history : (history?.content || []);
            setPriceHistoryList(safeList);
            setSelectedProductForHistory(product);
        } catch (err) {
            console.error('Error al consultar historial de precios:', err);
            alert('Error al obtener el historial de precios.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-[#003876]">Mantenimiento de Catálogo de Productos</h1>
                <p className="text-xs text-slate-500 mt-1">Gestión de artículos ferreteros, ciclo de vida e historial de precios.</p>
            </div>

            {/* Formulario de Alta */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-sm font-bold uppercase text-slate-700 mb-4 pb-2 border-b">Agregar Nuevo Producto</h2>
                
                {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">⚠️ {error}</div>}
                {success && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-200">✓ {success}</div>}

                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        placeholder="SKU Único (ej. ING-8801)"
                        value={sku}
                        onChange={e => setSku(e.target.value)}
                        className="p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-600"
                        required
                    />
                    <input
                        placeholder="Nombre Comercial del Producto"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-600"
                        required
                    />

                    <select
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        className="p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-600"
                        required
                    >
                        <option value="">-- Seleccione Categoría Activa --</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    <input
                        type="number"
                        step="0.01"
                        placeholder="Precio Inicial ($ USD)"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-600"
                        required
                    />

                    <select
                        value={supplierId}
                        onChange={e => setSupplierId(e.target.value)}
                        className="md:col-span-2 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-600"
                        required
                    >
                        <option value="">-- Seleccione Proveedor --</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.taxId || 'Sin NIT'})</option>)}
                    </select>

                    <textarea
                        placeholder="Descripción detallada del producto..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="md:col-span-2 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-600"
                        rows="2"
                    />

                    <button type="submit" className="md:col-span-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm py-2.5 rounded-lg shadow transition">
                        Guardar Producto en Catálogo (ACTIVE)
                    </button>
                </form>
            </div>

            {/* Tabla de Productos */}
            <div className="bg-white shadow-md rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#003876] text-white text-xs uppercase tracking-wider">
                            <th className="p-4">SKU</th>
                            <th className="p-4">Nombre del Producto</th>
                            <th className="p-4">Categoría</th>
                            <th className="p-4 text-right">Precio Activo ($)</th>
                            <th className="p-4 text-center">Estado</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                        {products.map(p => {
                            const displayPrice = p.currentPrice ?? p.price ?? 0;
                            const isActive = p.status === 'ACTIVE';
                            return (
                                <tr key={p.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 font-mono font-bold text-blue-900">{p.sku}</td>
                                    <td className="p-4 font-medium text-slate-800">{p.name}</td>
                                    <td className="p-4 text-xs text-slate-600">{p.category || 'General'}</td>
                                    <td className="p-4 text-right font-black text-slate-900">
                                        ${typeof displayPrice === 'number' ? displayPrice.toFixed(2) : '0.00'}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleUpdatePrice(p.id)}
                                                className="bg-blue-100 text-blue-900 hover:bg-blue-200 text-xs font-bold px-2.5 py-1 rounded transition"
                                                title="Nuevo precio vigente"
                                            >
                                                💲 Nuevo Precio
                                            </button>
                                            <button
                                                onClick={() => handleOpenHistory(p)}
                                                className="bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-bold px-2.5 py-1 rounded transition"
                                                title="Ver historial de cambios"
                                            >
                                                📜 Historial
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(p)}
                                                className={`text-xs font-bold px-2.5 py-1 rounded transition ${isActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                                            >
                                                {isActive ? '🚫 Inactivar' : '✓ Activar'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal Historial de Precios */}
            {selectedProductForHistory && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden">
                        <div className="bg-[#003876] text-white px-6 py-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold">Historial de Precios: {selectedProductForHistory.name}</h3>
                                <p className="text-xs text-blue-200">SKU: {selectedProductForHistory.sku}</p>
                            </div>
                            <button onClick={() => setSelectedProductForHistory(null)} className="text-white text-2xl font-bold">&times;</button>
                        </div>
                        <div className="p-6">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b text-xs font-bold uppercase text-slate-500">
                                        <th className="pb-2">Precio ($)</th>
                                        <th className="pb-2">Moneda</th>
                                        <th className="pb-2">Válido Desde</th>
                                        <th className="pb-2">Válido Hasta</th>
                                        <th className="pb-2 text-center">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-xs text-slate-700">
                                    {Array.isArray(priceHistoryList) && priceHistoryList.length > 0 ? (
                                        priceHistoryList.map(ph => (
                                            <tr key={ph.id} className="hover:bg-slate-50">
                                                <td className="py-2.5 font-bold">
                                                    ${typeof ph.unitPrice === 'number' ? ph.unitPrice.toFixed(2) : ph.unitPrice}
                                                </td>
                                                <td className="py-2.5">{ph.currency || 'USD'}</td>
                                                <td className="py-2.5">{ph.validFrom ? new Date(ph.validFrom).toLocaleString() : 'N/A'}</td>
                                                <td className="py-2.5">{ph.validTo ? new Date(ph.validTo).toLocaleString() : 'Vigente'}</td>
                                                <td className="py-2.5 text-center">
                                                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${ph.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                                                        {ph.isActive ? 'ACTIVO' : 'HISTÓRICO'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-4 text-center text-slate-500">
                                                No hay registros de precios para este producto.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-slate-50 px-6 py-3 text-right">
                            <button onClick={() => setSelectedProductForHistory(null)} className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
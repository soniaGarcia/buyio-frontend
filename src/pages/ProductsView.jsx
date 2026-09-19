import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, getSuppliers, updateProductPrice, getCategories, createCategory } from '../api/api';

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

    // Modal para Nueva Categoría
    const [showCatForm, setShowCatForm] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatDesc, setNewCatDesc] = useState('');

    const loadData = () => {
        getProducts().then(data => setProducts(Array.isArray(data) ? data : [])).catch(console.error);
        getSuppliers().then(data => setSuppliers(Array.isArray(data) ? data : [])).catch(console.error);
        getCategories().then(data => setCategories(Array.isArray(data) ? data : [])).catch(console.error);
    };

    useEffect(() => { loadData(); }, []);

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createProduct({
                sku, name, description,
                categoryId,
                supplierId,
                price: parseFloat(price)
            });
            setSku(''); setName(''); setDescription(''); setCategoryId(''); setSupplierId(''); setPrice('');
            loadData();
        } catch (err) {
            const apiMessage = err.response?.data?.message || 'Error al crear el producto. Verifique que el SKU sea único.';
            setError(apiMessage);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            const created = await createCategory({ name: newCatName, description: newCatDesc });
            setNewCatName(''); setNewCatDesc(''); setShowCatForm(false);
            await loadData();
            if (created?.id) setCategoryId(created.id);
        } catch (err) {
            alert('Error al guardar la nueva categoría.');
        }
    };

    const handleUpdatePrice = async (productId) => {
        const newPrice = prompt('Ingrese el nuevo precio activo para este producto (USD):');
        if (!newPrice || isNaN(newPrice) || parseFloat(newPrice) <= 0) return;

        try {
            await updateProductPrice(productId, { unitPrice: parseFloat(newPrice), currency: 'USD' });
            loadData();
        } catch (err) {
            alert('Error al actualizar el historial de precios.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-[#003876]">Mantenimiento de Catálogo de Productos</h1>
                <p className="text-xs text-slate-500 mt-1">Gestión de artículos ferreteros, precios vigentes y categorización.</p>
            </div>

            {/* Formulario de Alta */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-sm font-bold uppercase text-slate-700 mb-4 pb-2 border-b">Agregar Nuevo Producto</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </div>
                )}

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

                    <div className="flex gap-2">
                        <select
                            value={categoryId}
                            onChange={e => setCategoryId(e.target.value)}
                            className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        >
                            <option value="">-- Seleccione Categoría --</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <button
                            type="button"
                            onClick={() => setShowCatForm(!showCatForm)}
                            className="bg-blue-900 text-white font-bold px-3 py-2 rounded-md hover:bg-blue-800 transition"
                            title="Añadir nueva categoría"
                        >
                            +
                        </button>
                    </div>

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
                        placeholder="Descripción detallada del producto (especificaciones técnicas)..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="md:col-span-2 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-600"
                        rows="2"
                    />

                    <button
                        type="submit"
                        className="md:col-span-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm py-2.5 rounded-lg shadow transition"
                    >
                        Guardar Producto en Catálogo
                    </button>
                </form>
            </div>

            {/* Formulario Rápido de Categorías */}
            {showCatForm && (
                <div className="bg-slate-50 p-5 rounded-xl border border-blue-200 space-y-3">
                    <h3 className="font-bold text-blue-900 text-sm">Crear Nueva Categoría Rápidamente</h3>
                    <form onSubmit={handleCreateCategory} className="flex flex-col md:flex-row gap-3">
                        <input
                            placeholder="Nombre de la categoría (ej. Herramientas)"
                            value={newCatName}
                            onChange={e => setNewCatName(e.target.value)}
                            className="flex-1 p-2 border border-slate-300 rounded text-sm outline-none"
                            required
                        />
                        <input
                            placeholder="Descripción (opcional)"
                            value={newCatDesc}
                            onChange={e => setNewCatDesc(e.target.value)}
                            className="flex-1 p-2 border border-slate-300 rounded text-sm outline-none"
                        />
                        <button type="submit" className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded">Guardar</button>
                        <button type="button" onClick={() => setShowCatForm(false)} className="bg-slate-300 text-slate-700 text-xs font-bold px-4 py-2 rounded">Cancelar</button>
                    </form>
                </div>
            )}

            {/* Tabla de Productos */}
            <div className="bg-white shadow-md rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#003876] text-white text-xs uppercase tracking-wider">
                            <th className="p-4">SKU</th>
                            <th className="p-4">Nombre del Producto</th>
                            <th className="p-4">Categoría</th>
                            <th className="p-4">Proveedor</th>
                            <th className="p-4 text-right">Precio Activo ($)</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                        {products.map(p => {
                            const displayPrice = p.currentPrice ?? p.price ?? 0;
                            return (
                                <tr key={p.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 font-mono font-bold text-blue-900">{p.sku}</td>
                                    <td className="p-4 font-medium text-slate-800">{p.name}</td>
                                    <td className="p-4 text-xs text-slate-600">{p.category || 'General'}</td>
                                    <td className="p-4 text-xs text-slate-600">{p.supplierTaxId || 'N/A'}</td>
                                    <td className="p-4 text-right font-black text-slate-900">
                                        ${typeof displayPrice === 'number' ? displayPrice.toFixed(2) : '0.00'}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleUpdatePrice(p.id)}
                                            className="bg-blue-100 text-blue-900 hover:bg-blue-200 text-xs font-bold px-3 py-1.5 rounded transition"
                                        >
                                            💲 Actualizar Precio
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
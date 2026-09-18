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

    // Formulario / Estado de Nueva Categoría
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
            setError('Error al crear el producto. Verifique que el SKU sea único y los datos válidos.');
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            const created = await createCategory({ name: newCatName, description: newCatDesc });
            setNewCatName(''); setNewCatDesc(''); setShowCatForm(false);
            await loadData();
            setCategoryId(created.id); // Selecciona automáticamente la categoría recién creada
        } catch (err) {
            alert('Error al guardar la nueva categoría.');
        }
    };

    const handleUpdatePrice = async (productId) => {
        const newPrice = prompt('Ingrese el nuevo precio para este producto:');
        if (!newPrice || isNaN(newPrice)) return;

        try {
            await updateProductPrice(productId, parseFloat(newPrice));
            loadData();
        } catch (err) {
            alert('Error al actualizar el precio.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Mantenimiento de Productos y Precios</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleCreateProduct} style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '600px' }}>
                <input placeholder="SKU (Único)" value={sku} onChange={e => setSku(e.target.value)} required />
                <input placeholder="Nombre del Producto" value={name} onChange={e => setName(e.target.value)} required />
                
                <div style={{ display: 'flex', gap: '5px' }}>
                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required style={{ flex: 1 }}>
                        <option value="">Seleccione Categoría...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button type="button" onClick={() => setShowCatForm(!showCatForm)} style={{ padding: '0 8px' }}>+</button>
                </div>

                <input type="number" step="0.01" placeholder="Precio Inicial ($)" value={price} onChange={e => setPrice(e.target.value)} required />
                
                <select value={supplierId} onChange={e => setSupplierId(e.target.value)} required style={{ gridColumn: 'span 2' }}>
                    <option value="">Seleccione Proveedor...</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.taxId})</option>)}
                </select>
                
                <textarea placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} style={{ gridColumn: 'span 2' }} />
                <button type="submit" style={{ gridColumn: 'span 2' }}>Guardar Producto</button>
            </form>

            {/* Sub-formulario Rápido para Creación de Categorías */}
            {showCatForm && (
                <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', marginBottom: '20px', maxWidth: '600px', backgroundColor: '#f9f9f9' }}>
                    <h3>Nueva Categoría</h3>
                    <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input placeholder="Nombre de la categoría" value={newCatName} onChange={e => setNewCatName(e.target.value)} required />
                        <input placeholder="Descripción (Opcional)" value={newCatDesc} onChange={e => setNewCatDesc(e.target.value)} />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit">Guardar Categoría</button>
                            <button type="button" onClick={() => setShowCatForm(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th>SKU</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Proveedor (Tax ID)</th>
                        <th>Precio Activo ($)</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => {
                        const displayPrice = p.currentPrice ?? p.price ?? 0;
                        return (
                            <tr key={p.id}>
                                <td>{p.sku}</td>
                                <td>{p.name}</td>
                                <td>{p.category}</td>
                                <td>{p.supplierTaxId || 'N/A'}</td>
                                <td><strong>${typeof displayPrice === 'number' ? displayPrice.toFixed(2) : '0.00'}</strong></td>
                                <td>
                                    <button onClick={() => handleUpdatePrice(p.id)}>Cambiar Precio</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
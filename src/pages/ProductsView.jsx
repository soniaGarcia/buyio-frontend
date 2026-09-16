import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, getSuppliers } from '../api/api';

const API_CATALOG = 'http://localhost:8082/api/v1';

export function ProductsView() {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [sku, setSku] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');

    const loadData = () => {
        getProducts().then(setProducts);
        getSuppliers().then(setSuppliers);
    };

    useEffect(() => { loadData(); }, []);

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createProduct({
                sku, name, description, category,
                supplierId,
                price: parseFloat(price)
            });
            setSku(''); setName(''); setDescription(''); setCategory(''); setSupplierId(''); setPrice('');
            loadData();
        } catch (err) {
            setError('Error al crear el producto. Verifique que el SKU sea único y los datos válidos.');
        }
    };

    const handleUpdatePrice = async (productId) => {
        const newPrice = prompt('Ingrese el nuevo precio para este producto:');
        if (!newPrice || isNaN(newPrice)) return;

        const token = localStorage.getItem('token');
        const res = await fetch(`${API_CATALOG}/products/${productId}/prices`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(parseFloat(newPrice))
        });

        if (res.ok) {
            loadData();
        } else {
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
                <input placeholder="Categoría" value={category} onChange={e => setCategory(e.target.value)} />
                <input type="number" step="0.01" placeholder="Precio Inicial ($)" value={price} onChange={e => setPrice(e.target.value)} required />
                <select value={supplierId} onChange={e => setSupplierId(e.target.value)} required style={{ gridColumn: 'span 2' }}>
                    <option value="">Seleccione Proveedor...</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.taxId})</option>)}
                </select>
                <textarea placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} style={{ gridColumn: 'span 2' }} />
                <button type="submit" style={{ gridColumn: 'span 2' }}>Guardar Producto</button>
            </form>

            <table border="1" cellPadding="8" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Proveedor (Tax ID)</th>
                        <th>Precio Activo ($)</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.sku}</td>
                            <td>{p.name}</td>
                            <td>{p.category}</td>
                            <td>{p.supplierTaxId}</td>
                            <td><strong>${p.currentPrice ? p.currentPrice.toFixed(2) : '0.00'}</strong></td>
                            <td>
                                <button onClick={() => handleUpdatePrice(p.id)}>Cambiar Precio</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
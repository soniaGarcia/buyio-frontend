import React, { useState, useEffect } from 'react';
import { getSuppliers, getProducts, createOrder } from '../api/api';

export function CreateOrderModal({ onClose, onSuccess }) {
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [supplierId, setSupplierId] = useState('');
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        getSuppliers().then(setSuppliers);
        getProducts().then(setProducts);
    }, []);

    const addItem = () => {
        setItems([...items, { productId: '', quantity: 1, unitPrice: 0 }]);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        if (field === 'productId') {
            const prod = products.find(p => p.id === value);
            if (prod) newItems[index].unitPrice = prod.currentPrice;
        }
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + (item.quantity * item.unitPrice || 0), 0).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!supplierId || !expectedDeliveryDate || items.length === 0) {
            setError('Complete todos los campos obligatorios y agregue al menos un producto.');
            return;
        }
        try {
            await createOrder({
                supplierId,
                expectedDeliveryDate,
                items: items.map(i => ({
                    productId: i.productId,
                    quantity: parseInt(i.quantity),
                    unitPrice: parseFloat(i.unitPrice)
                }))
            });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', padding: '20px' }}>
            <div style={{ background: '#fff', padding: '20px', maxWidth: '600px', margin: 'auto', borderRadius: '8px' }}>
                <h3>Nueva Orden de Compra</h3>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Proveedor: </label>
                        <select value={supplierId} onChange={e => setSupplierId(e.target.value)} required>
                            <option value="">Seleccione...</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.taxId})</option>)}
                        </select>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <label>Fecha Estimada de Ingreso: </label>
                        <input type="date" value={expectedDeliveryDate} onChange={e => setExpectedDeliveryDate(e.target.value)} required />
                    </div>

                    <h4>Detalle de Productos</h4>
                    {items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                            <select value={item.productId} onChange={e => updateItem(index, 'productId', e.target.value)} required>
                                <option value="">Producto...</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <input type="number" min="1" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} placeholder="Cant" style={{ width: '60px' }} required />
                            <input type="number" step="0.01" value={item.unitPrice} onChange={e => updateItem(index, 'unitPrice', e.target.value)} placeholder="Precio" style={{ width: '80px' }} required />
                            <span>Subtotal: ${(item.quantity * item.unitPrice || 0).toFixed(2)}</span>
                        </div>
                    ))}
                    <button type="button" onClick={addItem} style={{ marginTop: '5px' }}>+ Agregar Producto</button>

                    <h3 style={{ textAlign: 'right' }}>Total: ${calculateTotal()}</h3>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={onClose}>Cancelar</button>
                        <button type="submit">Guardar Orden</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
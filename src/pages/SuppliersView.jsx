import React, { useState, useEffect } from 'react';
import { getSuppliers, createSupplier } from '../api/api';

export function SuppliersView() {
    const [suppliers, setSuppliers] = useState([]);
    const [taxId, setTaxId] = useState('');
    const [name, setName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const loadSuppliers = () => getSuppliers().then(setSuppliers);
    useEffect(() => { loadSuppliers(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createSupplier({ taxId, name, contactEmail, phone });
            setTaxId(''); setName(''); setContactEmail(''); setPhone('');
            loadSuppliers();
        } catch (err) {
            setError('Error al registrar proveedor. Verifique que el correo y datos sean válidos.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Mantenimiento de Proveedores</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input placeholder="NIT / Tax ID" value={taxId} onChange={e => setTaxId(e.target.value)} required />
                <input placeholder="Nombre Proveedor" value={name} onChange={e => setName(e.target.value)} required />
                <input type="email" placeholder="Correo Electrónico" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required />
                <input placeholder="Teléfono" value={phone} onChange={e => setPhone(e.target.value)} />
                <button type="submit">Guardar Proveedor</button>
            </form>

            <table border="1" cellPadding="8" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Tax ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map(s => (
                        <tr key={s.id}>
                            <td>{s.taxId}</td>
                            <td>{s.name}</td>
                            <td>{s.contactEmail}</td>
                            <td>{s.phone}</td>
                            <td>{s.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
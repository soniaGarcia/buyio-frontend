import React, { useState, useEffect } from 'react';
import { getSuppliers, createSupplier } from '../api/api';

export function SuppliersView() {
    const [suppliers, setSuppliers] = useState([]);
    const [taxId, setTaxId] = useState('');
    const [name, setName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const loadSuppliers = () => getSuppliers().then(setSuppliers).catch(console.error);
    useEffect(() => { loadSuppliers(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createSupplier({ taxId, name, contactEmail, phone });
            setTaxId(''); setName(''); setContactEmail(''); setPhone('');
            loadSuppliers();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar el proveedor. Verifique los datos.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-[#003876]">Directorio de Proveedores</h1>
                <p className="text-xs text-slate-500 mt-1">Gestión de razones sociales, NIT/Tax ID y contactos comerciales.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-sm font-bold uppercase text-slate-700 mb-4 pb-2 border-b">Nuevo Proveedor</h2>
                {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input placeholder="NIT / Tax ID" value={taxId} onChange={e => setTaxId(e.target.value)} className="p-2 border rounded text-sm" required />
                    <input placeholder="Nombre Comercial" value={name} onChange={e => setName(e.target.value)} className="p-2 border rounded text-sm" required />
                    <input type="email" placeholder="Correo Electrónico" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="p-2 border rounded text-sm" required />
                    <input placeholder="Teléfono" value={phone} onChange={e => setPhone(e.target.value)} className="p-2 border rounded text-sm" />
                    <button type="submit" className="md:col-span-4 bg-orange-600 text-white font-bold text-sm py-2 rounded hover:bg-orange-500 transition">
                        Guardar Proveedor
                    </button>
                </form>
            </div>

            <div className="bg-white shadow-md rounded-xl border overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#003876] text-white text-xs uppercase">
                            <th className="p-4">Tax ID / NIT</th>
                            <th className="p-4">Nombre Comercial</th>
                            <th className="p-4">Correo Contacto</th>
                            <th className="p-4">Teléfono</th>
                            <th className="p-4 text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                        {suppliers.map(s => (
                            <tr key={s.id || s.taxId} className="hover:bg-slate-50">
                                <td className="p-4 font-mono font-bold text-blue-900">{s.taxId || s.tax_id}</td>
                                <td className="p-4 font-semibold text-slate-800">{s.name}</td>
                                <td className="p-4 text-slate-600">{s.contactEmail || s.contact_email}</td>
                                <td className="p-4 text-slate-600">{s.phone || 'N/A'}</td>
                                <td className="p-4 text-center">
                                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">
                                        {s.status || 'ACTIVE'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
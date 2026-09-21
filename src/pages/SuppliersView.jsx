import React, { useState, useEffect } from 'react';
import { getSuppliers, createSupplier } from '../api/api';

export function SuppliersView() {
    const [suppliers, setSuppliers] = useState([]);
    const [taxId, setTaxId] = useState('');
    const [name, setName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Expresión regular para validar el NIT o DUI (14 dígitos o 9 dígitos con formato El Salvador)
    const NIT_REGEX = /^(\d{4}-\d{6}-\d{3}-\d{1}|\d{8}-\d{1})$/;
    // Expresión regular para validar Teléfono completo (+503 XXXX-XXXX)
    const PHONE_REGEX = /^\+503\s[267]\d{3}-\d{4}$/;

    const loadSuppliers = () => getSuppliers().then(setSuppliers).catch(console.error);
    useEffect(() => { loadSuppliers(); }, []);

    // Formateador dinámico de teléfono con máscara fija +503 XXXX-XXXX
    const handlePhoneChange = (e) => {
        const rawInput = e.target.value;
        
        // 1. Extraer solo caracteres numéricos
        let digits = rawInput.replace(/\D/g, '');

        // 2. Si la cadena empieza con '503' (prefijo ya renderizado), lo removemos
        if (digits.startsWith('503')) {
            digits = digits.slice(3);
        }

        // 3. Limitar estrictamente a 8 dígitos
        digits = digits.slice(0, 8);

        // 4. Aplicar máscara
        if (digits.length === 0) {
            setPhone('');
        } else if (digits.length <= 4) {
            setPhone(`+503 ${digits}`);
        } else {
            setPhone(`+503 ${digits.slice(0, 4)}-${digits.slice(4)}`);
        }
    };

    const validateForm = () => {
        if (!taxId.trim()) {
            setError('El NIT/DUI es obligatorio.');
            return false;
        }
        if (!NIT_REGEX.test(taxId.trim())) {
            setError('El NIT/DUI ingresado no tiene un formato válido (ej: 0614-280389-101-1 o 01234567-8).');
            return false;
        }
        if (!name.trim()) {
            setError('El Nombre Comercial es obligatorio.');
            return false;
        }
        if (!contactEmail.trim()) {
            setError('El Correo Electrónico es obligatorio.');
            return false;
        }
        if (!phone.trim()) {
            setError('El Teléfono es obligatorio.');
            return false;
        }
        if (!PHONE_REGEX.test(phone.trim())) {
            setError('El número de teléfono debe ser un número válido de 8 dígitos y comenzar por 2, 6 o 7 (ej: +503 7890-1234).');
            return false;
        }

        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        try {
            await createSupplier({ 
                taxId: taxId.trim(), 
                name: name.trim(), 
                contactEmail: contactEmail.trim(), 
                phone: phone.trim() 
            });
            setTaxId(''); setName(''); setContactEmail(''); setPhone('');
            setSuccess('Proveedor registrado exitosamente.');
            loadSuppliers();
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Error al registrar el proveedor.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-[#003876]">Directorio de Proveedores</h1>
                <p className="text-xs text-slate-500 mt-1">Gestión de razones sociales, NIT/DUI y contactos comerciales.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-sm font-bold uppercase text-slate-700 mb-4 pb-2 border-b">Nuevo Proveedor</h2>
                
                {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">⚠️ {error}</div>}
                {success && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-200">✓ {success}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                            NIT <span className="text-red-500">*</span>
                        </label>
                        <input 
                            placeholder="0614-280389-101-1" 
                            value={taxId} 
                            onChange={e => setTaxId(e.target.value)} 
                            className="w-full p-2 border border-slate-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-600" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                            Nombre Comercial <span className="text-red-500">*</span>
                        </label>
                        <input 
                            placeholder="Nombre Comercial" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            className="w-full p-2 border border-slate-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-600" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                            Correo Electrónico <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="email" 
                            placeholder="contacto@empresa.com" 
                            value={contactEmail} 
                            onChange={e => setContactEmail(e.target.value)} 
                            className="w-full p-2 border border-slate-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-600" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                            Teléfono (+503) <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text"
                            placeholder="+503 7890-1234" 
                            value={phone} 
                            onChange={handlePhoneChange} 
                            maxLength={15}
                            className="w-full p-2 border border-slate-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-600 font-mono" 
                            required 
                        />
                    </div>

                    <button type="submit" className="md:col-span-4 bg-orange-600 text-white font-bold text-sm py-2 rounded hover:bg-orange-500 transition shadow">
                        Guardar Proveedor
                    </button>
                </form>
            </div>

            <div className="bg-white shadow-md rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#003876] text-white text-xs uppercase">
                            <th className="p-4">NIT</th>
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
                                <td className="p-4 text-slate-600 font-mono">{s.phone || 'N/A'}</td>
                                <td className="p-4 text-center">
                                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full border border-emerald-300">
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
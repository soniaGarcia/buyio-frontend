import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategoryStatus } from '../api/api';

export function CategoriesView() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const loadCategories = () => {
        getCategories(false)
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(console.error);
    };

    useEffect(() => { loadCategories(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await createCategory({ name, description });
            setName(''); setDescription('');
            setSuccess('Categoría creada exitosamente.');
            loadCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear la categoría.');
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        setError(''); setSuccess('');
        const newStatus = !currentStatus;
        try {
            await updateCategoryStatus(id, newStatus);
            setSuccess(`Categoría ${newStatus ? 'activada' : 'inactivada'} con éxito.`);
            loadCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudo cambiar el estado de la categoría.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-[#003876]">Gestión de Categorías</h1>
                <p className="text-xs text-slate-500 mt-1">Mantenimiento de familias de productos y control de estado.</p>
            </div>

            {/* Formulario */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-sm font-bold uppercase text-slate-700 mb-4 pb-2 border-b">Nueva Categoría</h2>
                {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">⚠️ {error}</div>}
                {success && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-200">✓ {success}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                        placeholder="Nombre de la categoría"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-600"
                        required
                    />
                    <input
                        placeholder="Descripción (opcional)"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm py-2.5 rounded-lg transition shadow">
                        Guardar Categoría
                    </button>
                </form>
            </div>

            {/* Tabla */}
            <div className="bg-white shadow-md rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#003876] text-white text-xs uppercase">
                            <th className="p-4">Nombre</th>
                            <th className="p-4">Descripción</th>
                            <th className="p-4 text-center">Estado</th>
                            <th className="p-4 text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                        {categories.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50">
                                <td className="p-4 font-bold text-slate-800">{c.name}</td>
                                <td className="p-4 text-slate-600 text-xs">{c.description || 'Sin descripción'}</td>
                                <td className="p-4 text-center">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${c.isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                                        {c.isActive ? 'ACTIVA' : 'INACTIVA'}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => handleToggleStatus(c.id, c.isActive)}
                                        className={`text-xs font-bold px-3 py-1.5 rounded transition ${c.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                                    >
                                        {c.isActive ? '🚫 Inactivar' : '✓ Activar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
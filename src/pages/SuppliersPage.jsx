import { useState, useEffect } from 'react';
import { getSuppliers, createSupplier } from '../api/services';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);
  const [newSupplier, setNewSupplier] = useState({ tax_id: '', name: '', contact_email: '', phone: '', status: 'ACTIVE' });

  const loadSuppliers = async () => {
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err) {
      setError('No se pudo conectar con buyio-catalog-service.');
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createSupplier(newSupplier);
      setNewSupplier({ tax_id: '', name: '', contact_email: '', phone: '', status: 'ACTIVE' });
      loadSuppliers();
    } catch (err) {
      alert('Error al guardar el proveedor');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Directorio de Proveedores</h1>
      {error && <div className="p-4 bg-yellow-100 text-yellow-800 rounded mb-4">{error}</div>}

      <form onSubmit={handleCreate} className="bg-white p-4 rounded-lg border border-slate-200 mb-6 flex gap-4 flex-wrap">
        <input className="border p-2 rounded flex-1" placeholder="Tax ID" value={newSupplier.tax_id} onChange={e => setNewSupplier({...newSupplier, tax_id: e.target.value})} required />
        <input className="border p-2 rounded flex-1" placeholder="Nombre Comercial" value={newSupplier.name} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} required />
        <input className="border p-2 rounded flex-1" placeholder="Email" value={newSupplier.contact_email} onChange={e => setNewSupplier({...newSupplier, contact_email: e.target.value})} required />
        <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded font-semibold">Guardar</button>
      </form>

      <table className="w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="p-3 text-left">Tax ID</th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Contacto</th>
            <th className="p-3 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id || s.tax_id} className="border-b">
              <td className="p-3 font-semibold">{s.tax_id}</td>
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.contact_email}</td>
              <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-bold">{s.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
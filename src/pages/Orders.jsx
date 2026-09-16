import { useState, useEffect } from 'react';
import axiosClient, { ORDER_URL } from '../api/axiosClient';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get(ORDER_URL);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await axiosClient.patch(`${ORDER_URL}/${orderId}/cancel`);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-600">Cargando órdenes...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-slate-800">Gestión de Órdenes</h2>
      <div className="bg-white shadow border rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b text-slate-700 uppercase text-xs">
              <th className="p-4">Nº Orden</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Total</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-mono text-sm">{o.orderNumber}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    o.status === 'CREATED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-4 font-semibold">${o.totalAmount}</td>
                <td className="p-4 text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="p-4">
                  {o.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleCancel(o.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition"
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import { useState, useEffect, useContext } from 'react';
import axiosClient, { CATALOG_URL, ORDER_URL } from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get(CATALOG_URL);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (product) => {
    if (!user || !user.userId) {
      setMessage('Error: Inicie sesión para generar una orden.');
      return;
    }

    try {
      const orderPayload = {
        userId: user.userId,
        items: [
          {
            productId: product.id,
            productName: product.name,
            quantity: 1,
            unitPrice: product.price
          }
        ]
      };
      await axiosClient.post(ORDER_URL, orderPayload);
      setMessage(`¡Orden creada exitosamente para ${product.name}!`);
    } catch (err) {
      setMessage('Error al procesar la orden.');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-600">Cargando catálogo...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-slate-800">Catálogo de Productos</h2>
      {message && <div className="bg-blue-100 text-blue-800 p-3 rounded mb-6 text-sm">{message}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white border rounded-lg p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-800">{p.name}</h3>
              <p className="text-gray-600 mt-2 text-sm">{p.description}</p>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <span className="text-lg font-bold text-indigo-600">${p.price}</span>
              <button
                onClick={() => handleBuy(p)}
                className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 transition"
              >
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
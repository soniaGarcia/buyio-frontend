import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(credentials);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Error de conexión con el servicio de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
        <div className="bg-[#003876] text-white p-6 text-center border-b border-blue-900">
          <div className="bg-orange-600 text-white font-black text-2xl tracking-tighter inline-block px-3 py-1 rounded-md mb-2">
            BUYIO
          </div>
          <h2 className="text-xl font-bold">Portal de Gestión Ferretera</h2>
          <p className="text-xs text-blue-200 mt-1">Ingrese sus credenciales corporativas para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">{error}</div>}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Usuario</label>
            <input
              type="text"
              required
              className="w-full p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-600"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Contraseña</label>
            <input
              type="password"
              required
              className="w-full p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-600"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-lg shadow transition disabled:opacity-50"
          >
            {loading ? 'Autenticando...' : 'Ingresar al Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}
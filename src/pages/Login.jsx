import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient, { AUTH_URL } from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState(''); // Cambiado de email a username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Envía username y password al backend
      const res = await axiosClient.post(`${AUTH_URL}/login`, { username, password });
      
      // Guarda los datos devueltos en el contexto de autenticación
      login(res.data.token, {
        username: res.data.username || username,
        role: res.data.role,
        userId: res.data.userId
      });
      
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Iniciar Sesión</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
          <input
            type="text"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ej: usuario1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition"
        >
          Entrar
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
        ¿No tienes cuenta? <Link to="/register" className="text-indigo-600 hover:underline">Regístrate</Link>
      </p>
    </div>
  );
}
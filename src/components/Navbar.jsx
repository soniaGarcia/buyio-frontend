import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wide text-indigo-400">
        BuyIO Platform
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/products" className="hover:text-indigo-300">Productos</Link>
            <Link to="/orders" className="hover:text-indigo-300">Órdenes</Link>
            <Link to="/audit" className="hover:text-indigo-300">Auditoría</Link>
            <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
            >
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-indigo-300">Iniciar Sesión</Link>
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm transition">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="shadow-lg sticky top-0 z-40">
      {/* Top Utility Bar */}
      <div className="bg-[#002D62] text-slate-300 text-xs px-6 py-1.5 flex justify-between items-center border-b border-blue-900">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-orange-400">SISTEMA DE COMPRAS E INVENTARIO</span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline">Gestión Integral de Órdenes de Compra y Catálogos</span>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-white">{user.username || user.email}</span>
          </div>
        )}
      </div>

      {/* Main Navbar */}
      <nav className="bg-[#003876] text-white px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-orange-600 text-white p-2 rounded-md font-black text-xl tracking-tighter group-hover:bg-orange-500 transition">
            BUY<span className="text-blue-100">IO</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-wide leading-none text-lg">LA FERRETERÍA</span>
            <span className="text-[10px] text-blue-200 tracking-widest uppercase">Soluciones Industriales</span>
          </div>
        </Link>

        {user ? (
          <div className="flex items-center gap-1 md:gap-3">
            <Link
              to="/orders"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition ${
                isActive('/orders') ? 'bg-orange-600 text-white shadow' : 'hover:bg-blue-800 text-blue-100'
              }`}
            >
              Órdenes de Compra
            </Link>

            <Link
              to="/products"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition ${
                isActive('/products') ? 'bg-orange-600 text-white shadow' : 'hover:bg-blue-800 text-blue-100'
              }`}
            >
              Catálogo de Productos
            </Link>

            <Link
              to="/suppliers"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition ${
                isActive('/suppliers') ? 'bg-orange-600 text-white shadow' : 'hover:bg-blue-800 text-blue-100'
              }`}
            >
              Proveedores
            </Link>

            <Link
              to="/audit"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition ${
                isActive('/audit') ? 'bg-orange-600 text-white shadow' : 'hover:bg-blue-800 text-blue-100'
              }`}
            >
              Auditoría
            </Link>

            <button
              onClick={handleLogout}
              className="ml-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-bold transition shadow"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-800 transition">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="bg-orange-600 hover:bg-orange-500 px-4 py-1.5 rounded text-sm font-bold shadow transition">
              Registrarse
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
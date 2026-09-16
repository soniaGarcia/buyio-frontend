import React, { useState } from 'react';
import { OrdersView } from './views/OrdersView';
import { SuppliersView } from './views/SuppliersView';
import { ProductsView } from './views/ProductsView';
import { CreateOrderModal } from './components/CreateOrderModal';

export default function App() {
  const [currentView, setCurrentView] = useState('orders');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      {/* Menu Principal de Navegacion */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '15px 30px', color: '#fff' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>BuyIO Platform</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button 
            onClick={() => setCurrentView('orders')} 
            style={{ background: 'none', border: 'none', color: currentView === 'orders' ? '#60a5fa' : '#cbd5e1', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
            Órdenes
          </button>
          <button 
            onClick={() => setCurrentView('products')} 
            style={{ background: 'none', border: 'none', color: currentView === 'products' ? '#60a5fa' : '#cbd5e1', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
            Productos
          </button>
          <button 
            onClick={() => setCurrentView('suppliers')} 
            style={{ background: 'none', border: 'none', color: currentView === 'suppliers' ? '#60a5fa' : '#cbd5e1', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
            Proveedores
          </button>
          <button 
            onClick={handleLogout} 
            style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
            Salir
          </button>
        </div>
      </nav>

      {/* Renderizado Dinamico de Vistas */}
      <main style={{ maxWidth: '1200px', margin: '30px auto', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {currentView === 'orders' && (
          <OrdersView onOpenCreateModal={() => setShowCreateModal(true)} />
        )}
        {currentView === 'products' && <ProductsView />}
        {currentView === 'suppliers' && <SuppliersView />}
      </main>

      {/* Modal de Creacion Maestro-Detalle */}
      {showCreateModal && (
        <CreateOrderModal 
          onClose={() => setShowCreateModal(false)} 
          onSuccess={() => {
            setShowCreateModal(false);
            setCurrentView('orders');
          }} 
        />
      )}
    </div>
  );
}
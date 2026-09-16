import React, { useState } from 'react';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('orders');

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f3f4f6',
        fontFamily: 'sans-serif'
      }}>
        <form onSubmit={handleLogin} style={{
          backgroundColor: '#ffffff',
          padding: '2.5rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827', textAlign: 'center' }}>
            BuyIO Platform - Login
          </h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Usuario / Correo
            </label>
            <input
              type="text"
              required
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              style={{
                width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
                borderRadius: '4px', fontSize: '1rem', boxSizing: 'border-box'
              }}
              placeholder="admin@buyio.com"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Contraseña
            </label>
            <input
              type="password"
              required
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              style={{
                width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
                borderRadius: '4px', fontSize: '1rem', boxSizing: 'border-box'
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%', backgroundColor: '#4f46e5', color: '#ffffff',
              padding: '0.75rem', border: 'none', borderRadius: '4px',
              fontWeight: '600', cursor: 'pointer', fontSize: '1rem'
            }}
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f8', fontFamily: 'sans-serif' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
        height: '60px',
        backgroundColor: '#111827',
        color: '#ffffff'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>BuyIO Platform</h2>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button 
            onClick={() => setActiveTab('orders')} 
            style={{
              background: 'none', border: 'none', color: activeTab === 'orders' ? '#6366f1' : '#d1d5db',
              cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            Órdenes
          </button>
          <button 
            onClick={() => setActiveTab('products')} 
            style={{
              background: 'none', border: 'none', color: activeTab === 'products' ? '#6366f1' : '#d1d5db',
              cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            Productos
          </button>
          <button 
            onClick={() => setActiveTab('suppliers')} 
            style={{
              background: 'none', border: 'none', color: activeTab === 'suppliers' ? '#6366f1' : '#d1d5db',
              cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            Proveedores
          </button>
          <button 
            onClick={() => setActiveTab('audit')} 
            style={{
              background: 'none', border: 'none', color: activeTab === 'audit' ? '#6366f1' : '#d1d5db',
              cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            Auditoría
          </button>
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc2626', color: '#fff', border: 'none',
              padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            Salir
          </button>
        </nav>
      </header>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {activeTab === 'orders' && (
          <section>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Órdenes de Compra (Purchase Orders)</h1>
            <p style={{ color: '#4b5563' }}>Gestión de órdenes con proveedores, trazabilidad y estados.</p>
          </section>
        )}

        {activeTab === 'products' && (
          <section>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Catálogo de Productos</h1>
            <p style={{ color: '#4b5563' }}>Inventario e insumos disponibles en plataforma.</p>
          </section>
        )}

        {activeTab === 'suppliers' && (
          <section>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Proveedores Registrados</h1>
            <p style={{ color: '#4b5563' }}>Directorio corporativo de proveedores (Catalog Service).</p>
          </section>
        )}

        {activeTab === 'audit' && (
          <section>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Logs de Auditoría</h1>
            <p style={{ color: '#4b5563' }}>Eventos registrados del sistema vía RabbitMQ / Kafka.</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';

// URL base de la API (ajusta los puertos si usas un API Gateway o cada puerto individual)
const API_URLS = {
  catalog: 'http://localhost:8082/api/v1',
  orders: 'http://localhost:8083/api/v1',
  audit: 'http://localhost:8084/api/v1'
};

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('orders');

  // Estados de datos
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Formulario nuevo proveedor
  const [newSupplier, setNewSupplier] = useState({ tax_id: '', name: '', contact_email: '', phone: '', status: 'ACTIVE' });

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

  // Cargar datos al cambiar de pestaña
  useEffect(() => {
    if (!isAuthenticated) return;

    if (activeTab === 'suppliers') {
      fetch(`${API_URLS.catalog}/suppliers`)
        .then(res => res.json())
        .then(data => setSuppliers(Array.isArray(data) ? data : []))
        .catch(() => setSuppliers([
          { id: '1', tax_id: 'J-12345678-0', name: 'Tech Distribution Inc.', contact_email: 'contacto@techdist.com', phone: '+1 555-0192', status: 'ACTIVE' },
          { id: '2', tax_id: 'J-87654321-9', name: 'Global Logistics S.A.', contact_email: 'ventas@globallogistics.com', phone: '+1 555-0198', status: 'ACTIVE' }
        ]));
    }

    if (activeTab === 'products') {
      fetch(`${API_URLS.catalog}/products`)
        .then(res => res.json())
        .then(data => setProducts(Array.isArray(data) ? data : []))
        .catch(() => setProducts([
          { id: '1', name: 'Laptop Pro 15', description: 'Intel i7 16GB RAM 512GB SSD', price: 1200.00, stock: 25 },
          { id: '2', name: 'Teclado Mecánico RGB', description: 'Switches Brown anti-ghosting', price: 85.50, stock: 100 }
        ]));
    }

    if (activeTab === 'orders') {
      fetch(`${API_URLS.orders}/orders`)
        .then(res => res.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setOrders([
          { id: 'ORD-001', supplierName: 'Tech Distribution Inc.', itemsCount: 3, total: 3600.00, status: 'APPROVED', createdAt: '2026-03-28' },
          { id: 'ORD-002', supplierName: 'Global Logistics S.A.', itemsCount: 1, total: 850.00, status: 'PENDING', createdAt: '2026-03-29' }
        ]));
    }

    if (activeTab === 'audit') {
      fetch(`${API_URLS.audit}/logs`)
        .then(res => res.json())
        .then(data => setAuditLogs(Array.isArray(data) ? data : []))
        .catch(() => setAuditLogs([
          { id: '1', event: 'ORDER_CREATED', user: 'admin@buyio.com', timestamp: '2026-03-29 10:15:22', details: 'Orden ORD-002 creada correctamente' },
          { id: '2', event: 'SUPPLIER_REGISTERED', user: 'admin@buyio.com', timestamp: '2026-03-28 14:30:10', details: 'Nuevo proveedor registrado: Tech Distribution' }
        ]));
    }
  }, [activeTab, isAuthenticated]);

  const handleCreateSupplier = (e) => {
    e.preventDefault();
    fetch(`${API_URLS.catalog}/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSupplier)
    })
    .then(res => res.json())
    .then(data => {
      setSuppliers([...suppliers, data]);
      setNewSupplier({ tax_id: '', name: '', contact_email: '', phone: '', status: 'ACTIVE' });
    })
    .catch(() => {
      // Agregar localmente si el backend no está conectado
      setSuppliers([...suppliers, { ...newSupplier, id: Date.now().toString() }]);
      setNewSupplier({ tax_id: '', name: '', contact_email: '', phone: '', status: 'ACTIVE' });
    });
  };

  // Pantalla de Login
  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827', textAlign: 'center' }}>BuyIO Platform - Login</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Usuario / Correo</label>
            <input type="text" required value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem', boxSizing: 'border-box' }} placeholder="admin@buyio.com" />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Contraseña</label>
            <input type="password" required value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem', boxSizing: 'border-box' }} placeholder="••••••••" />
          </div>
          <button type="submit" style={{ width: '100%', backgroundColor: '#4f46e5', color: '#ffffff', padding: '0.75rem', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}>Iniciar Sesión</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f8', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem', height: '60px', backgroundColor: '#111827', color: '#ffffff' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>BuyIO B2B Platform</h2>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {['orders', 'products', 'suppliers', 'audit'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none', border: 'none', color: activeTab === tab ? '#818cf8' : '#d1d5db',
                cursor: 'pointer', fontWeight: activeTab === tab ? 'bold' : 'normal', fontSize: '0.95rem',
                borderBottom: activeTab === tab ? '2px solid #818cf8' : 'none', paddingBottom: '4px'
              }}
            >
              {tab === 'orders' && 'Órdenes'}
              {tab === 'products' && 'Productos'}
              {tab === 'suppliers' && 'Proveedores'}
              {tab === 'audit' && 'Auditoría'}
            </button>
          ))}
          <button onClick={handleLogout} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Salir</button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* 1. SECCIÓN ÓRDENES */}
        {activeTab === 'orders' && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Órdenes de Compra (Purchase Orders)</h1>
                <p style={{ color: '#4b5563', fontSize: '0.9rem' }}>Gestión de órdenes enviadas a proveedores corporativos.</p>
              </div>
              <button style={{ backgroundColor: '#4f46e5', color: '#fff', padding: '0.6rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>+ Nueva Órden</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem', color: '#374151' }}>ID Órden</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#374151' }}>Proveedor</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#374151' }}>Ítems</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#374151' }}>Total USD</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#374151' }}>Estado</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#374151' }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>{o.id}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{o.supplierName}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{o.itemsCount}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>${o.total.toFixed(2)}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ backgroundColor: o.status === 'APPROVED' ? '#d1fae5' : '#fef3c7', color: o.status === 'APPROVED' ? '#065f46' : '#92400e', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{o.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* 2. SECCIÓN PRODUCTOS */}
        {activeTab === 'products' && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Catálogo de Productos</h1>
                <p style={{ color: '#4b5563', fontSize: '0.9rem' }}>Inventario e insumos disponibles en la red BuyIO.</p>
              </div>
              <button style={{ backgroundColor: '#4f46e5', color: '#fff', padding: '0.6rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>+ Crear Producto</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {products.map((p) => (
                <div key={p.id} style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>{p.name}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem', minHeight: '40px' }}>{p.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#4f46e5' }}>${p.price.toFixed(2)}</span>
                    <span style={{ fontSize: '0.8rem', color: '#374151', backgroundColor: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Stock: {p.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. SECCIÓN PROVEEDORES */}
        {activeTab === 'suppliers' && (
          <section>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Directorio de Proveedores</h1>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Gestión centralizada mediante <code style={{ backgroundColor: '#e5e7eb', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>buyio-catalog-service</code>.</p>

            {/* Formulario Agregar Proveedor */}
            <form onSubmit={handleCreateSupplier} style={{ backgroundColor: '#fff', padding: '1rem 1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e5e7eb', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <input type="text" required placeholder="Tax ID (ej. J-12345)" value={newSupplier.tax_id} onChange={e => setNewSupplier({ ...newSupplier, tax_id: e.target.value })} style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', flex: '1', minWidth: '150px' }} />
              <input type="text" required placeholder="Nombre Comercial" value={newSupplier.name} onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })} style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', flex: '1', minWidth: '180px' }} />
              <input type="email" required placeholder="Correo de contacto" value={newSupplier.contact_email} onChange={e => setNewSupplier({ ...newSupplier, contact_email: e.target.value })} style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', flex: '1', minWidth: '180px' }} />
              <input type="text" placeholder="Teléfono" value={newSupplier.phone} onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })} style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', flex: '1', minWidth: '120px' }} />
              <button type="submit" style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>+ Guardar</button>
            </form>

            {/* Tabla de Proveedores */}
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem', color: '#374151' }}>Tax ID</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#374151' }}>Nombre</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#374151' }}>Contacto</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#374151' }}>Teléfono</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#374151' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.id || s.tax_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>{s.tax_id}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{s.name}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{s.contact_email}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{s.phone || 'N/A'}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 'bold' }}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* 4. SECCIÓN AUDITORÍA */}
        {activeTab === 'audit' && (
          <section>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Logs de Auditoría y Eventos</h1>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Registro de transacciones capturadas desde RabbitMQ / Kafka.</p>

            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem', color: '#374151' }}>Evento</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#374151' }}>Usuario</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#374151' }}>Fecha y Hora</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#374151' }}>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ backgroundColor: '#e0e7ff', color: '#3730a3', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>{log.event}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{log.user}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{log.timestamp}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#374151' }}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

      </main>
    </div>
  );
}

export default App;
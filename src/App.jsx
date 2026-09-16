import React, { useState } from 'react';

export function App() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f8', fontFamily: 'sans-serif' }}>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 2rem', height: '60px', backgroundColor: '#111827', color: '#ffffff'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>BuyIO Platform</h2>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', color: activeTab === 'orders' ? '#6366f1' : '#d1d5db', cursor: 'pointer' }}>Órdenes</button>
          <button onClick={() => setActiveTab('products')} style={{ background: 'none', border: 'none', color: activeTab === 'products' ? '#6366f1' : '#d1d5db', cursor: 'pointer' }}>Productos</button>
          <button onClick={() => setActiveTab('suppliers')} style={{ background: 'none', border: 'none', color: activeTab === 'suppliers' ? '#6366f1' : '#d1d5db', cursor: 'pointer' }}>Proveedores</button>
          <button onClick={() => setActiveTab('audit')} style={{ background: 'none', border: 'none', color: activeTab === 'audit' ? '#6366f1' : '#d1d5db', cursor: 'pointer' }}>Auditoría</button>
        </nav>
      </header>
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Plataforma B2B BuyIO</h1>
        <p style={{ color: '#4b5563' }}>Pestaña seleccionada: {activeTab}</p>
      </main>
    </div>
  );
}

export default App;
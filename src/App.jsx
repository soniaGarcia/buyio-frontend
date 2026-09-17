import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import { OrdersView } from './pages/OrdersView';
import { ProductsView } from './pages/ProductsView';
import { SuppliersView } from './pages/SuppliersView';
import AuditLogs from './pages/AuditLogs';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
          <Navbar />
          <main className="max-w-7xl mx-auto p-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/orders" element={<OrdersView />} />
                <Route path="/products" element={<ProductsView />} />
                <Route path="/suppliers" element={<SuppliersView />} />
                <Route path="/audit" element={<AuditLogs />} />
              </Route>

              <Route path="*" element={<Navigate to="/orders" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
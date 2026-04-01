import React from 'react';
import { SocketProvider } from './context/SocketContext';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import UsersAdmin from './pages/admin/UsersAdmin';
import OrdersAdmin from './pages/admin/OrdersAdmin';
import CategoriesAdmin from './pages/admin/CategoriesAdmin';
import InventoryAdmin from './pages/admin/InventoryAdmin';
import CustomersAdmin from './pages/admin/CustomersAdmin';

function AppContent() {
  const location = useLocation();
  const hideFooterPath = location.pathname.startsWith('/admin') || 
                         location.pathname === '/login' || 
                         location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-brand-bg)] text-[var(--color-brand-primary)] selection:bg-[var(--color-brand-secondary)] selection:text-[var(--color-brand-on-secondary)]">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={
            <ProtectedRoute requiredRole="superadmin">
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="inventory" element={<InventoryAdmin />} />
          <Route path="customers" element={
            <ProtectedRoute requiredRole="superadmin">
              <CustomersAdmin />
            </ProtectedRoute>
          } />
          <Route path="users" element={
            <ProtectedRoute requiredRole="superadmin">
              <UsersAdmin />
            </ProtectedRoute>
          } />
          <Route path="orders" element={<OrdersAdmin />} />
        </Route>
      </Routes>
      {!hideFooterPath && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Router>
          <AppContent />
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

import React, { useContext, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Box, Users, ShoppingBag, ArrowLeft, Tags, ClipboardList, UserCircle, Menu, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { title: 'Dashboard', path: '/admin', icon: LayoutDashboard, role: 'superadmin' },
    { title: 'Products', path: '/admin/products', icon: Box, role: 'admin' },
    { title: 'Categories', path: '/admin/categories', icon: Tags, role: 'admin' },
    { title: 'Inventory', path: '/admin/inventory', icon: ClipboardList, role: 'admin' },
    { title: 'Orders', path: '/admin/orders', icon: ShoppingBag, role: 'admin' },
    { title: 'Customers', path: '/admin/customers', icon: UserCircle, role: 'superadmin' },
    { title: 'Users', path: '/admin/users', icon: Users, role: 'superadmin' },
  ].filter(item => {
    if (item.role === 'superadmin') return user?.role === 'superadmin';
    return true; 
  });

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[var(--color-brand-primary)] text-white pt-8">
      <div className="px-8 mb-10 flex flex-col gap-2">
        <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white mb-4">
           <ArrowLeft size={16} />
           <span className="text-[11px] font-bold uppercase tracking-wider">Storefront</span>
        </Link>
        <span className="text-xl font-bold tracking-tight">Tea Admin</span>
      </div>

      <nav className="flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-8 py-4 transition-colors ${isActive ? 'bg-white/10 text-white font-bold border-l-4 border-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              <Icon size={18} />
              <span className="text-[13px] tracking-wide">{item.title}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-8 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold uppercase">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold leading-none mb-1">{user?.name}</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">{user?.role}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row relative">
      {/* Mobile Header */}
      <header className="md:hidden bg-[var(--color-brand-primary)] text-white p-4 flex justify-between items-center sticky top-0 z-[100]">
        <span className="font-bold text-lg">Tea Admin</span>
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      </header>

      {/* Admin Sidebar Desktop */}
      <aside className="hidden md:flex w-64 fixed inset-y-0 left-0">
        <SidebarContent />
      </aside>

      {/* Admin Sidebar Mobile */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[110] md:hidden" onClick={() => setIsSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 z-[120] md:hidden transform transition-transform duration-300">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Admin Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

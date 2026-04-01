import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, LogOut, Menu, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import NotificationBell from '../notifications/NotificationBell';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full h-20 border-b border-gray-100 bg-[var(--color-brand-bg)] sticky top-0 z-[100]">
      <div className="max-w-[1440px] h-full mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-[var(--color-brand-primary)]"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        <Link to="/" className="flex items-center">
          <img src={logo} alt="Brand Name Tea Logo" className="h-10 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-10 text-[10px] font-bold tracking-[0.2em] text-[#282828] uppercase">
          <Link to="/collection" className="hover:text-gray-500 transition-colors">Tea Collections</Link>
          <a href="#" className="hover:text-gray-500 transition-colors">Accessories</a>
          <a href="#" className="hover:text-gray-500 transition-colors">Blog</a>
          <a href="#" className="hover:text-gray-500 transition-colors">Contact Us</a>
        </nav>

        <div className="flex items-center space-x-6 text-[#282828]">
          <button className="hidden sm:block hover:text-gray-500 transition-colors">
            <Search size={20} strokeWidth={1.5} />
          </button>

          <NotificationBell />
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {(user.role === 'admin' || user.role === 'superadmin') && (
                  <Link 
                    to={user.role === 'superadmin' ? "/admin" : "/admin/products"}
                    className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-black hover:bg-black hover:text-white transition-all"
                  >
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} title="Logout" className="hover:text-gray-500 transition-colors">
                  <LogOut size={20} strokeWidth={1.5} />
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-gray-500 transition-colors" title="Login">
                <User size={20} strokeWidth={1.5} />
              </Link>
            )}
          </div>

          <Link to="/cart" className="relative group p-1 -mr-1">
            <ShoppingBag size={21} strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-brand-primary)] text-white text-[9px] flex items-center justify-center rounded-full">0</span>
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[120] shadow-2xl transition-transform duration-500 md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex justify-between items-center border-b border-gray-100">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <button onClick={() => setIsMenuOpen(false)} className="text-gray-400">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-8 py-10 flex flex-col gap-6 uppercase text-[12px] font-bold tracking-[0.2em]">
            <Link to="/collection" onClick={() => setIsMenuOpen(false)}>Tea Collections</Link>
            <a href="#" onClick={() => setIsMenuOpen(false)}>Accessories</a>
            <a href="#" onClick={() => setIsMenuOpen(false)}>Blog</a>
            <a href="#" onClick={() => setIsMenuOpen(false)}>Contact Us</a>
            
            <div className="h-[1px] bg-gray-100 my-4" />
            
            {user ? (
               <>
                 {(user.role === 'admin' || user.role === 'superadmin') && (
                   <Link 
                     to={user.role === 'superadmin' ? "/admin" : "/admin/products"} 
                     onClick={() => setIsMenuOpen(false)}
                   >
                     Admin Panel
                   </Link>
                 )}
                 <button onClick={handleLogout} className="text-left">Log Out</button>
               </>
            ) : (
               <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
            )}
          </nav>
        </div>
      </aside>
    </header>
  );
};

export default Navbar;

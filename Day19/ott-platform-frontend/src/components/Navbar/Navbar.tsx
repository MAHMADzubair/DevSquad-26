import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="h-[100px] md:h-[120px] bg-transparent w-full z-50 relative">
      <div className="flex flex-row justify-between items-center px-[15px] laptop:px-[80px] desktop:px-[162px] py-[20px] md:py-[30px] h-full w-full max-w-[1920px] mx-auto">
        
        {/* Logo Container */}
        <Link to="/" className="flex items-center cursor-pointer">
          <img
            src="/logo.png"
            alt="Netixsol Logo"
            className="w-[116px] h-[35px] laptop:w-[165px] laptop:h-[50px] desktop:w-[199px] desktop:h-[60px]"
          />
        </Link>
        
        {/* Mobile Menu Toggle button */}
        <button 
          className="lg:hidden p-2 bg-[#1A1A1A] border-[3px] border-[#1F1F1F] rounded-[8px] text-text-p hover:text-primary transition-colors focus:outline-none ml-auto"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation Buttons Container */}
        <div className="hidden lg:flex flex-row items-center pt-[10px] pb-[10px] pl-[10px] pr-[10px] gap-[5px] desktop:gap-[10px] w-auto h-[60px] desktop:h-[75px] bg-bg-custom border-[4px] border-border-custom rounded-[12px] absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <Link
            to="/"
            className={`flex items-center justify-center px-[16px] desktop:px-[24px] py-[10px] desktop:py-[14px] text-[16px] desktop:text-[18px] font-medium leading-[150%] transition-all rounded-[8px] ${
              isActive("/") ? "bg-surface text-text-p" : "text-text-s hover:text-text-p"
            }`}
          > Home </Link>
          <Link
            to="/movies"
            className={`flex items-center justify-center px-[16px] desktop:px-[24px] py-[10px] desktop:py-[14px] text-[16px] desktop:text-[18px] font-medium leading-[150%] transition-all rounded-[8px] ${
              isActive("/movies") ? "bg-surface text-text-p" : "text-text-s hover:text-text-p"
            }`}
          > Movies & Shows </Link>
          <Link
            to="/support"
            className={`flex items-center justify-center px-[16px] desktop:px-[24px] py-[10px] desktop:py-[14px] text-[16px] desktop:text-[18px] font-medium leading-[150%] transition-all rounded-[8px] ${
              isActive("/support") ? "bg-surface text-text-p" : "text-text-s hover:text-text-p"
            }`}
          > Support </Link>
          <Link
            to="/plans"
            className={`flex items-center justify-center px-[16px] desktop:px-[24px] py-[10px] desktop:py-[14px] text-[16px] desktop:text-[18px] font-medium leading-[150%] transition-all rounded-[8px] ${
              isActive("/plans") || isActive("/subscriptions") ? "bg-surface text-text-p" : "text-text-s hover:text-text-p"
            }`}
          > Subscriptions </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center justify-center px-[16px] desktop:px-[24px] py-[10px] desktop:py-[14px] text-[16px] desktop:text-[18px] font-medium leading-[150%] transition-all rounded-[8px] border border-primary/20 text-primary hover:bg-primary/10`}
            >
              <LayoutDashboard size={18} className="mr-2 hidden desktop:block" />
              Admin Panel
            </Link>
          )}
        </div>

        {/* Utilities/Action Icons Container */}
        <div className="flex flex-row items-center gap-[15px] md:gap-[25px]">
          <button className="text-text-p hover:opacity-70 transition-opacity p-2 hidden sm:block">
            <Search size={28} />
          </button>
          <button className="text-text-p hover:opacity-70 transition-opacity p-2 hidden sm:block">
            <Bell size={28} />
          </button>
          
          <div className="h-8 w-[1px] bg-border-custom hidden md:block mx-0 md:mx-2" />

          {isAuthenticated ? (
            <div className="flex items-center gap-2 md:gap-4">
              <Link 
                to="/profile" 
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-[8px] border transition-all ${isActive('/profile') ? 'bg-surface border-primary' : 'bg-transparent border-border-custom hover:bg-surface'}`}
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {user?.name?.[0] || 'U'}
                </div>
                <span className="text-text-p font-medium hidden lg:block">{user?.name}</span>
              </Link>
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="p-3 bg-surface border border-border-custom rounded-[8px] text-text-s hover:text-primary transition-colors hidden sm:block"
                title="Logout"
              >
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              <Link 
                to="/login" 
                className="text-text-p px-4 md:px-6 py-2 md:py-3 font-semibold hover:text-primary transition-colors hidden sm:block"
              > Login </Link>
              <Link 
                to="/register" 
                className="bg-primary text-text-p px-4 md:px-6 py-2 md:py-3 rounded-[8px] font-semibold hover:bg-red-700 transition-colors whitespace-nowrap hidden sm:block"
              > Sign Up </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-[100px] md:top-[120px] left-0 w-full bg-bg-custom border-b border-border-custom border-t py-4 px-4 flex flex-col gap-4 shadow-2xl animate-fade-in z-50">
          <Link
            to="/"
            className={`px-4 py-3 rounded-[8px] text-[16px] font-medium transition-colors ${isActive("/") ? "bg-surface text-primary" : "text-text-p hover:bg-surface"}`}
          > Home </Link>
          <Link
            to="/movies"
            className={`px-4 py-3 rounded-[8px] text-[16px] font-medium transition-colors ${isActive("/movies") ? "bg-surface text-primary" : "text-text-p hover:bg-surface"}`}
          > Movies & Shows </Link>
          <Link
            to="/support"
            className={`px-4 py-3 rounded-[8px] text-[16px] font-medium transition-colors ${isActive("/support") ? "bg-surface text-primary" : "text-text-p hover:bg-surface"}`}
          > Support </Link>
          <Link
            to="/plans"
            className={`px-4 py-3 rounded-[8px] text-[16px] font-medium transition-colors ${isActive("/plans") || isActive("/subscriptions") ? "bg-surface text-primary" : "text-text-p hover:bg-surface"}`}
          > Subscriptions </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center px-4 py-3 rounded-[8px] text-[16px] font-medium transition-colors ${isActive("/admin") ? "bg-primary/20 text-primary border border-primary/20" : "text-text-p hover:bg-surface"}`}
            >
              <LayoutDashboard size={18} className="mr-2" /> Admin Panel
            </Link>
          )}
          
          <div className="h-[1px] w-full bg-border-custom my-2" />
          
          <div className="flex gap-4 px-4 py-2">
            <button className="text-text-p hover:text-primary transition-colors"><Search size={24} /></button>
            <button className="text-text-p hover:text-primary transition-colors"><Bell size={24} /></button>
          </div>

          {!isAuthenticated ? (
            <div className="flex flex-col gap-3 mt-2">
              <Link to="/login" className="w-full py-3 text-center border border-border-custom text-text-p rounded-[8px] font-semibold hover:bg-surface">
                Login
              </Link>
              <Link to="/register" className="w-full py-3 text-center bg-primary text-text-p rounded-[8px] font-semibold hover:bg-red-700 transition-colors">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="flex items-center justify-center gap-2 w-full py-3 bg-surface border border-border-custom text-text-p hover:text-primary rounded-[8px] font-semibold transition-colors"
                title="Logout"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

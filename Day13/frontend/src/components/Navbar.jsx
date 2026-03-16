import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bell, Search, User, Menu } from "lucide-react";
import gsap from "gsap";
import logo from "../assets/logo.jpg";

export default function Navbar({ onMenuClick }) {
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const ctx = gsap.context(() => {
      gsap.from(".nav-anim", {
        opacity: 0,
        y: -10,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2
      });
    }, navRef);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark/80 backdrop-blur-xl border-b border-white/10 shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="w-full px-4 md:px-8 flex justify-between items-center">
        {/* Left side: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden p-2 -ml-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            onClick={onMenuClick}
            aria-label="Toggle Menu"
          >
            <Menu size={24} />
          </button>
          
          <Link
            to="/dashboard"
            className="flex items-center gap-2 group cursor-pointer nav-anim"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,90,90,0.4)] group-hover:shadow-[0_0_30px_rgba(255,139,90,0.6)] transition-all hidden sm:block">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-brand-yellow transition-colors">
              Netix<span className="text-brand-orange">Sol</span>
            </span>
          </Link>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full w-96 transition-all focus-within:border-brand-orange focus-within:bg-white/10 focus-within:shadow-[0_0_15px_rgba(255,139,90,0.2)] nav-anim">
          <Search size={18} className="text-white/40 mr-3" />
          <input
            type="text"
            placeholder="Search projects, tasks, or team..."
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-white/40"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5 nav-anim">
          <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-red rounded-full shadow-[0_0_10px_rgba(255,90,90,0.8)] border-2 border-dark"></span>
          </button>

          <div className="flex items-center gap-3 pl-5 border-l border-white/10 cursor-pointer group">
            <div className="text-right hidden md:block">
              <div className="text-sm font-semibold text-white group-hover:text-brand-yellow transition-colors">
                Workspace
              </div>
              <div className="text-xs text-white/50">Admin User</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-brand-red to-brand-orange p-[2px]">
              <div className="w-full h-full rounded-full bg-dark-2 flex items-center justify-center border border-white/10">
                <User size={18} className="text-brand-yellow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

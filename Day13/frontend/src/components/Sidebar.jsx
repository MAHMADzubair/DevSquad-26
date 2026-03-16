import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  CheckSquare,
  LogOut,
  X,
} from "lucide-react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".side-anim", {
        opacity: 0,
        x: -20,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.3
      });
    }, sidebarRef);
    return () => ctx.revert();
  }, []);

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/projects", icon: FolderKanban, label: "Projects" },
    { path: "/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/members", icon: Users, label: "Team" },
  ];

  return (
    <div 
      ref={sidebarRef} 
      className={`fixed md:relative top-[65px] md:top-0 left-0 w-64 h-[calc(100vh-65px)] md:h-full border-r border-white/5 bg-[#0a0a0f] md:bg-[#0a0a0f]/80 backdrop-blur-3xl z-50 flex flex-col pt-8 transition-transform duration-300 shadow-2xl md:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="px-6 flex-1">
        <div className="flex justify-between items-center mb-6 side-anim">
          <div className="text-xs font-bold text-white/30 uppercase tracking-widest">
            Menu
          </div>
          <button 
            className="md:hidden text-white/50 hover:text-white p-1"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path} className="side-anim">
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                    isActive
                      ? "bg-linear-to-r from-brand-red/20 to-brand-orange/5 text-brand-yellow border border-brand-red/30 shadow-[0_0_20px_rgba(255,90,90,0.15)]"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-brand-orange" : "opacity-70"}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-6 border-t border-white/5 mt-auto side-anim">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/60 hover:bg-red-500/10 hover:text-brand-red transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

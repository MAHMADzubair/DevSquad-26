import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  CheckSquare,
  LogOut,
} from "lucide-react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function Sidebar() {
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
    <div ref={sidebarRef} className="w-64 h-full border-r border-white/5 bg-dark/80 backdrop-blur-3xl flex flex-col pt-8">
      <div className="px-6 flex-1">
        <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6 side-anim">
          Menu
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

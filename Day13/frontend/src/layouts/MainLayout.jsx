import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-dark text-white font-sans selection:bg-brand-red/30">
      {/* Animated Global Background inside Layout */}
      <div className="glow-mesh">
        <div
          style={{
            width: "40vw",
            height: "40vw",
            background: "var(--color-brand-red)",
            top: "-10%",
            left: "-5%",
            opacity: 0.12,
          }}
        ></div>
        <div
          style={{
            width: "35vw",
            height: "35vw",
            background: "var(--color-brand-yellow)",
            bottom: "-10%",
            right: "-5%",
            opacity: 0.1,
          }}
        ></div>
      </div>

      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex w-full mt-[65px] h-[calc(100vh-65px)] relative z-10">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto custom-scrollbar relative w-full">
          <div className="relative z-10">{children}</div>
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, PackageOpen, LogOut, ShieldAlert, Monitor } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Categories", href: "/admin/categories", icon: <PackageOpen size={18} /> },
    { name: "Products", href: "/admin/products", icon: <PackageOpen size={18} /> },
    { name: "Home Collections", href: "/admin/collections", icon: <Monitor className="rotate-0" size={18} /> },
    { name: "Orders", href: "/admin/orders", icon: <ShoppingBag size={18} /> },
    { name: "Users", href: "/admin/users", icon: <Users size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-900 flex text-white relative flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-950 border-r border-white/10 shrink-0 sticky top-0 h-screen hidden md:flex flex-col">
         
         <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
           <Link href="/">
              <h1 className="text-2xl font-black italic text-noon-yellow tracking-tighter">noon</h1>
           </Link>
           <div className="ml-2 pl-2 border-l border-white/20 text-xs font-bold text-gray-400">ADMIN</div>
         </div>

         <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
            {links.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition ${isActive ? 'bg-noon-yellow text-zinc-950 font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              )
            })}
         </div>

         <div className="p-4 border-t border-white/10 shrink-0">
           <Link href="/" className="flex justify-center bg-white/5 hover:bg-white/10 py-2 rounded text-sm font-bold transition text-center mb-2">Return to Shop</Link>
           <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex justify-center py-2 w-full text-red-400 hover:bg-red-500/10 rounded text-sm font-bold transition"
           >
              Log Out
           </button>
         </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-16 bg-zinc-950 border-b border-white/10 flex items-center px-8 md:px-12 sticky top-0 z-10 text-sm font-bold">
            <ShieldAlert className="text-noon-yellow mr-2" size={18} /> Control Panel Access
          </header>
          <main className="p-8 pb-20 flex-1">
            {children}
          </main>
      </div>
    </div>
  );
}

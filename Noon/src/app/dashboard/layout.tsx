"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart, MapPin, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: <User size={18} /> },
    { name: "My Orders", href: "/dashboard/orders", icon: <Package size={18} /> },
    { name: "Wishlist", href: "/dashboard/wishlist", icon: <Heart size={18} /> },
    { name: "Addresses", href: "/dashboard", icon: <MapPin size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-noon-yellow w-full h-14 flex items-center px-4 md:px-8 shadow-sm">
        <Link href="/">
           <h1 className="text-xl md:text-2xl font-black italic tracking-tighter text-noon-black">noon</h1>
        </Link>
        <div className="ml-4 pl-4 border-l border-noon-black/20 font-bold text-sm">
           My Account
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
             
             {/* User Info */}
             <div className="p-6 border-b border-gray-100 flex items-center gap-4">
               <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-xl text-gray-500">
                  {session?.user?.name?.charAt(0) || "U"}
               </div>
               <div>
                 <h2 className="font-bold text-sm">{session?.user?.name}</h2>
                 <p className="text-xs text-gray-500 truncate w-32">{session?.user?.email}</p>
               </div>
             </div>

             {/* Links */}
             <div className="p-2">
               {links.map(link => {
                 const isActive = pathname === link.href;
                 return (
                   <Link 
                     key={link.name} 
                     href={link.href}
                     className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition ${isActive ? 'bg-blue-50 text-noon-blue' : 'text-gray-600 hover:bg-gray-50'}`}
                   >
                     {link.icon}
                     {link.name}
                   </Link>
                 )
               })}
             </div>

             {/* Logout */}
             <div className="p-4 border-t border-gray-100 mt-2">
               <button 
                 onClick={() => signOut({ callbackUrl: '/' })}
                 className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition w-full p-2"
               >
                 <LogOut size={16} /> Sign Out
               </button>
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

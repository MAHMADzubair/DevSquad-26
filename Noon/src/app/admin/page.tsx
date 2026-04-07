"use client";

import { useEffect, useState } from "react";
import { Users, ShoppingBag, PackageOpen, LayoutDashboard, Loader2, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;
  }

  const statCards = [
    { title: "Total Users", value: stats?.totalUsers || 0, icon: <Users size={24} className="text-blue-400" /> },
    { title: "Total Orders", value: stats?.totalOrders || 0, icon: <ShoppingBag size={24} className="text-emerald-400" /> },
    { title: "Products", value: stats?.totalProducts || 0, icon: <PackageOpen size={24} className="text-amber-400" /> },
    { title: "Gross Revenue", value: `AED ${stats?.totalRevenue?.toLocaleString() || 0}`, icon: <DollarSign size={24} className="text-rose-400" /> },
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-8">
      <div>
         <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-2">
            <LayoutDashboard /> Overview
         </h1>
         <p className="text-gray-400">Welcome to the central admin hub. Note: this is a clone.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(card => (
          <div key={card.title} className="bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="text-gray-400 font-bold uppercase text-xs tracking-wider">{card.title}</div>
              <div className="p-2 bg-white/5 rounded-lg border border-white/5">{card.icon}</div>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">{card.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
         {/* Recent Orders Table */}
         <div className="lg:col-span-2 bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
               <h3 className="font-bold text-white uppercase text-xs tracking-widest">Recent Orders</h3>
               <button onClick={() => window.location.href='/admin/orders'} className="text-[10px] text-noon-yellow font-black uppercase hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-xs text-gray-400">
                  <thead className="bg-white/5 font-bold uppercase text-[10px]">
                     <tr>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {stats?.recentOrders?.map((order: any) => (
                        <tr key={order.id} className="hover:bg-white/5 transition">
                           <td className="px-6 py-4">
                              <div className="font-bold text-white">{order.user.name}</div>
                              <div className="text-[10px] opacity-50">{order.user.email}</div>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${order.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                 {order.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right font-black text-white">
                              AED {order.total.toLocaleString()}
                           </td>
                        </tr>
                     ))}
                     {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                        <tr>
                           <td colSpan={3} className="px-6 py-8 text-center text-gray-500 italic">No recent orders yet.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Stats mini charts placeholders */}
         <div className="flex flex-col gap-6">
            <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 h-48 flex flex-col justify-center items-center text-gray-500">
               [Revenue Chart]
            </div>
            <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 h-48 flex flex-col justify-center items-center text-gray-500">
               [Category Sales]
            </div>
         </div>
      </div>
    </div>
  );
}

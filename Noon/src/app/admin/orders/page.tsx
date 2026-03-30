"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      } else {
        alert("Failed to update status");
      }
    } catch {
       alert("Error updating status");
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-8">
      <div>
         <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-2">Orders</h1>
         <p className="text-gray-400 text-sm">View purchase history and update fulfillment.</p>
      </div>

      <div className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
               <thead className="bg-white/5 text-xs uppercase font-bold text-gray-400 tracking-wider">
                  <tr>
                     <th className="px-6 py-4">Order ID & Date</th>
                     <th className="px-6 py-4">Customer</th>
                     <th className="px-6 py-4">Total</th>
                     <th className="px-6 py-4">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/10">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <Loader2 className="animate-spin mx-auto text-gray-400" />
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center font-bold text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  ) : orders.map(order => {
                     const date = new Date(order.createdAt).toLocaleDateString();
                     return (
                       <tr key={order.id} className="hover:bg-white/5 transition">
                         <td className="px-6 py-4">
                           <div className="font-mono text-white text-xs mb-1">{order.id}</div>
                           <div className="text-gray-500 text-xs font-bold">{date}</div>
                         </td>
                         <td className="px-6 py-4">
                           <div className="font-bold text-white mb-1">{order.user.name}</div>
                           <div className="text-gray-500 text-xs">{order.user.email}</div>
                         </td>
                         <td className="px-6 py-4 font-black text-white">
                           AED {order.total.toLocaleString()}
                         </td>
                         <td className="px-6 py-4">
                            <select 
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`bg-zinc-900 border border-white/20 rounded px-3 py-1.5 font-bold text-xs uppercase focus:outline-none focus:ring-1 focus:ring-noon-yellow
                                ${order.status === "DELIVERED" ? "text-green-400" : order.status === "PENDING" ? "text-yellow-400" : "text-white"}
                              `}
                            >
                               <option value="PENDING">Pending</option>
                               <option value="PROCESSING">Processing</option>
                               <option value="SHIPPED">Shipped</option>
                               <option value="DELIVERED">Delivered</option>
                               <option value="CANCELLED">Cancelled</option>
                            </select>
                         </td>
                       </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

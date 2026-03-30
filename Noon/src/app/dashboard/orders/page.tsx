"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Package } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
           <Package size={40} className="text-gray-300" />
        </div>
        <h2 className="text-xl font-bold mb-2">No orders found</h2>
        <p className="text-gray-500 mb-6 max-w-xs">Looks like you haven't made your menu yet. Go ahead and explore top categories.</p>
        <Link href="/" className="bg-noon-blue text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 animate-fade-in">
      <h1 className="text-2xl font-black mb-6">My Orders</h1>
      
      <div className="flex flex-col gap-6">
        {orders.map((order) => {
          const items = JSON.parse(order.items || "[]");
          const date = new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
          
          let statusColor = "bg-yellow-100 text-yellow-800";
          if (order.status === "DELIVERED") statusColor = "bg-green-100 text-green-800";
          if (order.status === "CANCELLED") statusColor = "bg-red-100 text-red-800";
          if (order.status === "SHIPPED") statusColor = "bg-blue-100 text-blue-800";

          return (
            <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:border-noon-blue/50 transition">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4 text-sm">
                <div className="flex gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 font-bold uppercase text-[10px]">Order Placed</span>
                    <span className="font-semibold">{date}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 font-bold uppercase text-[10px]">Total</span>
                    <span className="font-bold text-noon-black">AED {order.total.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 font-bold uppercase text-[10px]">Order #</span>
                    <span className="font-mono">{order.id.slice(-8).toUpperCase()}</span>
                  </div>
                </div>
                <div>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                     {order.status}
                   </span>
                </div>
              </div>

              {/* Items */}
              <div className="p-6 flex flex-col gap-4">
                {items.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-20 h-20 relative shrink-0 border border-gray-100 rounded">
                       <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                    </div>
                    <div>
                       <Link href={`/product/${item.slug}`} className="font-medium text-sm hover:text-noon-blue hover:underline line-clamp-2 mb-1">{item.name}</Link>
                       <p className="text-xs text-gray-500">Sold by: <span className="font-bold text-noon-black">noon</span></p>
                       <p className="text-sm font-bold mt-2">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

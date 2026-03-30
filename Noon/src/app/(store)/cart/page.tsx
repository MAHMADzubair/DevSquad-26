"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShieldCheck } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 page-enter">
        <Image src="https://via.placeholder.com/200?text=Empty+Cart" width={200} height={200} alt="Empty Cart" />
        <h2 className="text-2xl font-black text-noon-black">Your shopping cart looks empty</h2>
        <p className="text-gray-500 text-center max-w-sm">What are you waiting for? Start shopping now and discover amazing deals.</p>
        <Link href="/" className="bg-noon-blue text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition">
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 page-enter">
      <h1 className="text-2xl font-black mb-6 border-b pb-4">Cart ({getTotalItems()} Items)</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3 flex flex-col gap-4">
          <div className="bg-green-50 text-green-800 p-3 rounded font-semibold text-sm border border-green-200 flex items-center gap-2">
            <ShieldCheck size={18} /> You are eligible for FREE Shipping and Returns!
          </div>

          <div className="flex flex-col gap-4 bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
            <h2 className="font-bold border-b pb-2 text-sm text-gray-500 uppercase">Items</h2>
             {items.map((item) => (
                <div key={item.productId} className="flex gap-4 border-b border-gray-100 py-4 last:border-0 relative">
                  <Link href={`/product/${item.slug}`} className="w-24 h-24 sm:w-32 sm:h-32 relative shrink-0 border rounded border-gray-100">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                  </Link>
                  
                  <div className="flex flex-col flex-1">
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="text-sm md:text-base font-medium text-noon-black line-clamp-2 hover:underline">{item.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-400 mt-1">Sold by <span className="text-noon-blue font-semibold">noon</span></p>

                    <div className="flex items-end justify-between mt-auto">
                      <div className="flex items-center gap-4">
                        <select 
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                          className="border rounded p-1 text-sm font-medium w-16 focus:ring-1 focus:outline-none"
                        >
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <option key={n} value={n}>Qty: {n}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => removeItem(item.productId)}
                          className="text-gray-400 hover:text-red-500 flex items-center gap-1 text-sm font-semibold transition"
                        >
                           <Trash2 size={16} /> <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                      
                      <div className="text-right">
                         <div className="text-lg font-black text-noon-black">AED {item.price.toLocaleString()}</div>
                         {item.quantity > 1 && <div className="text-[10px] text-gray-500">(AED {(item.price * item.quantity).toLocaleString()} total)</div>}
                      </div>
                    </div>
                  </div>
                </div>
             ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
           <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm sticky top-28">
             <h2 className="font-bold text-lg border-b pb-4 mb-4">Order Summary</h2>
             
             <div className="flex flex-col gap-3 text-sm mb-4 border-b pb-4 text-gray-600 font-medium">
               <div className="flex justify-between">
                 <span>Subtotal</span>
                 <span>AED {getTotalPrice().toLocaleString()}</span>
               </div>
               <div className="flex justify-between">
                 <span>Shipping</span>
                 <span className="text-noon-green">FREE</span>
               </div>
             </div>
             
             <div className="flex justify-between font-black text-xl mb-6">
               <span>Total</span>
               <span>AED {getTotalPrice().toLocaleString()}</span>
             </div>
             
             <Link href="/checkout" className="w-full bg-noon-blue hover:bg-blue-700 text-white font-bold py-4 rounded flex items-center justify-center transition shadow-md">
               CHECKOUT
             </Link>

             <div className="mt-4 flex flex-wrap gap-2 justify-center py-2 opacity-50 grayscale">
                <span className="text-2xl font-black italic">VISA</span>
                <span className="text-2xl font-black italic">Mastercard</span>
                <span className="text-2xl font-black italic">Apple Pay</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, MapPin, CreditCard, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // If not logged in, wait or redirect
  if (status === "unauthenticated") {
    router.push('/login');
    return null;
  }

  if (status === "loading" || !session) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-noon-blue" size={40} />
      </div>
    );
  }

  // If cart is empty and not success
  if (items.length === 0 && !success) {
     router.push("/cart");
     return null;
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    // Mocking an address for this clone without requiring users to fill a long form
    const mockAddress = {
      label: "Home",
      fullName: session.user?.name || "Customer",
      street: "123 Dubai Marina Walk",
      city: "Dubai",
      country: "UAE"
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address: mockAddress,
          subtotal: getTotalPrice(),
          shipping: 0,
          total: getTotalPrice(),
        })
      });

      if (res.ok) {
        clearCart();
        setSuccess(true);
        window.scrollTo(0, 0);
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      alert("Error placing order.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 page-enter">
        <CheckCircle2 size={80} className="text-noon-green" />
        <h1 className="text-3xl font-black">Order Placed Successfully!</h1>
        <p className="text-gray-500 flex max-w-md text-center">Thank you for shopping with noon. Your order is being processed and will be delivered soon.</p>
        <button 
           onClick={() => router.push("/dashboard/orders")}
           className="mt-4 bg-noon-black text-white px-8 py-3 font-bold rounded hover:bg-gray-800 transition"
        >
          VIEW MY ORDERS
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 page-enter">
      <h1 className="text-2xl font-black mb-6">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Checkout Forms (Mocked) */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          
          {/* Address Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="font-bold flex items-center gap-2 mb-4 border-b pb-2"><MapPin/> Delivery Address</h2>
            <div className="bg-blue-50/50 border border-noon-blue rounded p-4 relative">
               <div className="absolute top-4 right-4 bg-noon-blue text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">Selected</div>
               <h3 className="font-bold">{session.user?.name}</h3>
               <p className="text-sm text-gray-600 mt-1">123 Dubai Marina Walk<br/>Dubai, United Arab Emirates<br/>+971 50 123 4567</p>
            </div>
            <button className="text-noon-blue text-sm font-bold mt-4">+ Add a New Address</button>
          </div>

          {/* Payment Section (Mock UI) */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="font-bold flex items-center gap-2 mb-4 border-b pb-2"><CreditCard/> Payment Method</h2>
            
            <div className="border rounded p-4 flex items-start gap-3 cursor-pointer border-noon-blue bg-blue-50/30">
               <input type="radio" className="mt-1" defaultChecked />
               <div>
                  <h3 className="font-bold">Pay with Card</h3>
                  <p className="text-sm text-gray-500">Credit or debit card</p>
                  
                  {/* Mock card input UI */}
                  <div className="mt-4 flex flex-col gap-3 max-w-sm">
                     <input type="text" placeholder="Card Number" className="border rounded p-2 text-sm w-full outline-noon-blue" />
                     <div className="flex gap-2">
                        <input type="text" placeholder="MM/YY" className="border rounded p-2 text-sm w-1/2 outline-noon-blue" />
                        <input type="text" placeholder="CVV" className="border rounded p-2 text-sm w-1/2 outline-noon-blue" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="border rounded p-4 flex items-start gap-3 cursor-pointer mt-3 opacity-60">
               <input type="radio" disabled className="mt-1" />
               <div>
                  <h3 className="font-bold">Cash on Delivery</h3>
                  <p className="text-sm text-gray-500">Temporarily disabled for this demo</p>
               </div>
            </div>
          </div>

        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
           <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm sticky top-28">
             <h2 className="font-bold text-lg border-b pb-4 mb-4">Order Summary</h2>
             
             {/* Small item list */}
             <div className="flex flex-col gap-2 mb-4 border-b pb-4">
                {items.map(item => (
                   <div key={item.productId} className="flex gap-2 items-center text-sm">
                      <div className="relative w-10 h-10 bg-gray-50 rounded border shrink-0">
                         <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 truncate font-medium text-gray-700">{item.name}</div>
                      <div className="font-bold shrink-0 text-xs">x{item.quantity}</div>
                   </div>
                ))}
             </div>

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
             
             <div className="flex justify-between font-black text-xl mb-6 text-noon-black">
               <span>Total to Pay</span>
               <span>AED {getTotalPrice().toLocaleString()}</span>
             </div>
             
             <button 
               onClick={handlePlaceOrder}
               disabled={loading}
               className="w-full h-14 bg-noon-black hover:bg-gray-800 text-white font-bold rounded flex items-center justify-center transition shadow-md disabled:opacity-70"
             >
               {loading ? <Loader2 className="animate-spin" /> : "PLACE ORDER"}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}

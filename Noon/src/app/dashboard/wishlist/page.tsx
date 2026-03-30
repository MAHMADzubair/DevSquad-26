"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { Loader2, Heart } from "lucide-react";
import Link from "next/link";
import { useWishlistStore } from "@/store/cartStore";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { items: localWishlistArray } = useWishlistStore(); // to detect local changes instantly

  useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.map((item: any) => item.product));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [localWishlistArray]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
           <Heart size={40} className="text-gray-300" />
        </div>
        <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6 max-w-sm">Tap the heart on any product to save it to your wishlist.</p>
        <Link href="/" className="bg-noon-blue text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition">
          Discover Now
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-black mb-6">Wishlist Favorites</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

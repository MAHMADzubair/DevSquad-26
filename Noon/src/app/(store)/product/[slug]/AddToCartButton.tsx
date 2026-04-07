"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";

export default function AddToCartButton({ product }: { product: any }) {
  const { addItem, items, toggleCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  
  const images = JSON.parse(product.images || "[]");
  const fallbackImage = "https://via.placeholder.com/400?text=No+Image";

  const itemInCart = items.find(i => i.productId === product.id);

  const handleAddToCart = () => {
    addItem({
      id: product.id + "-" + Date.now(),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0] || fallbackImage,
      slug: product.slug,
      stock: product.stock,
      quantity: Math.min(quantity, product.stock),
    });
    toggleCart();
  };

  if (itemInCart) {
    return (
      <button 
        disabled
        className="w-full h-14 bg-gray-100 text-green-600 font-bold rounded flex items-center justify-center transition border border-green-200"
      >
        In Cart ({itemInCart.quantity})
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between border border-gray-200 rounded p-1 max-w-[120px]">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"
        >
          <Minus size={16} />
        </button>
        <span className="font-bold text-sm w-8 text-center">{quantity}</span>
        <button 
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30"
          disabled={quantity >= product.stock}
        >
          <Plus size={16} />
        </button>
      </div>

      <button 
        onClick={handleAddToCart}
        className="w-full h-14 bg-noon-blue hover:bg-blue-700 text-white font-bold rounded flex items-center justify-center gap-2 transition shadow-md"
      >
        <Plus size={20} /> ADD TO CART
      </button>
    </div>
  );
}

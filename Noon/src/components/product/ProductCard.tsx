"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Check, Plus } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/store/cartStore";

export default function ProductCard({ product }: { product: any }) {
  const images = JSON.parse(product.images || "[]");
  const fallbackImage = "https://via.placeholder.com/400?text=No+Image";

  const { addItem } = useCartStore();
  const { addItem: addWishlist, removeItem: removeWishlist, hasItem } = useWishlistStore();
  const inWishlist = hasItem(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id + "-" + Date.now(),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0] || fallbackImage,
      slug: product.slug,
      stock: product.stock,
      quantity: 1,
    });
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeWishlist(product.id);
    } else {
      addWishlist(product.id);
    }
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="bg-white p-2 md:p-3 rounded-lg border border-gray-100 product-card relative flex flex-col min-h-[340px] md:h-[400px] group transition-all hover:shadow-md cursor-pointer">
      {/* Background Link for navigation */}
      <Link href={`/product/${product.slug}`} className="absolute inset-0 z-[1]" aria-label={product.name} />
      
      {/* Wishlist Button - High z-index to stay above the Link overlay */}
      <button 
        onClick={toggleWishlist}
        className={`absolute top-4 right-4 z-[5] p-2 rounded-full shadow-sm bg-white/90 backdrop-blur transition-opacity ${inWishlist ? 'opacity-100 text-noon-red' : 'opacity-0 text-gray-400 group-hover:opacity-100 hover:text-noon-red'}`}
      >
        <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
      </button>

      {/* Image */}
      <div className="relative w-full h-48 mb-3 bg-white rounded-md flex items-center justify-center">
        <Image 
          src={images[0] || fallbackImage} 
          alt={product.name} 
          fill
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
        />
        {/* Badges */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1 items-start">
          {product.badge && (
            <span className={`badge-${product.badge.toLowerCase().replace(' ', '')}`}>
              {product.badge}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 pb-4 relative z-0">
        {/* Title */}
        <h3 className="text-xs md:text-sm font-medium text-noon-black line-clamp-2 leading-snug mb-1">
          {product.name}
        </h3>

        {/* Price & Rating Section fixed at bottom using mt-auto */}
        <div className="mt-auto">
          <div className="flex items-center gap-1 mb-2 mt-2">
            <h4 className="font-black text-lg">AED {product.price.toLocaleString()}</h4>
            <div className="flex flex-col md:flex-row md:items-center ml-2 text-[10px] sm:text-xs">
               {product.originalPrice && (
                 <>
                   <span className="text-gray-400 line-through">AED {product.originalPrice}</span>
                   {discount > 0 && <span className="text-noon-green font-bold md:ml-2">{discount}% Off</span>}
                 </>
               )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            {product.isNoonExpress ? (
               <span className="badge-express flex items-center gap-1">
                  noon <span className="italic">express</span>
               </span>
            ) : <span />}

            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500">
               <Star size={12} className="text-yellow-400" fill="currentColor" /> 
               {product.rating.toFixed(1)} <span className="text-gray-400 ml-1">({product.reviewCount})</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add To Cart Hover Button - High z-index to stay above Link overlay */}
      {product.stock > 0 ? (
        <button 
          onClick={handleAddToCart}
          className="absolute -bottom-4 right-4 z-[5] bg-white border border-gray-200 text-noon-black rounded-full font-bold shadow-md p-2 transition opacity-0 group-hover:opacity-100 group-hover:bottom-4 hover:bg-gray-50"
        >
          <Plus size={20} />
        </button>
      ) : (
        <span className="text-xs font-bold text-noon-red mt-auto relative z-[2]">Out of stock</span>
      )}
    </div>
  );
}

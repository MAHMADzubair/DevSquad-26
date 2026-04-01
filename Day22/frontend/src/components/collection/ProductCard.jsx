import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // If no product is passed (for fallback purposes), don't render or render placeholder
  if (!product) return null;

  const image = product.images?.[0] || "https://images.unsplash.com/photo-1594631252845-29fc4e8c7efc?q=80&w=400&auto=format&fit=crop";
  const nameParts = product.name.split(' ');
  const title1 = nameParts.slice(0, 2).join(' ');
  const title2 = nameParts.slice(2).join(' ');
  
  // Use the smallest variant's size or default to '50 g'
  const weight = product.variants?.[0]?.size || "50 g";

  return (
    <Link to={`/product/${product._id}`} className="flex flex-col items-center group cursor-pointer w-full hover:no-underline">
      <div className="w-full aspect-square overflow-hidden mb-6 bg-[#F4F4F4] flex items-center justify-center">
        <img 
          src={image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out mix-blend-multiply"
        />
      </div>
      <div className="flex flex-col items-center text-center space-y-3 px-2">
        <h3 className="text-[12px] md:text-[13px] font-medium tracking-[0.5px] text-[var(--color-brand-primary)] leading-snug">
          {title1}<br />{title2}
        </h3>
        <p className="text-[11px] tracking-[0.5px] mt-2">
          <span className="font-bold text-[13px] text-[var(--color-brand-primary)]">€{product.price.toFixed(2)}</span>
          <span className="text-gray-500 text-[10px]"> / {weight}</span>
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;

"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

export default function CategorySlider({ categories }: { categories: any[] }) {
  const mockCategories = [
    { id: '1', name: 'Electronics', slug: 'electronics', icon: '📱', color: '#eef2ff' },
    { id: '2', name: 'Fashion', slug: 'fashion', icon: '👗', color: '#fff1f2' },
    { id: '3', name: 'Beauty', slug: 'beauty', icon: '💄', color: '#fdf2f8' },
    { id: '4', name: 'Home', slug: 'home-kitchen', icon: '🏠', color: '#f0fdf4' },
    { id: '5', name: 'Grocery', slug: 'grocery', icon: '🛒', color: '#fffbeb' },
    { id: '6', name: 'Baby', slug: 'baby', icon: '👶', color: '#f0f9ff' },
    { id: '7', name: 'Sports', slug: 'sports', icon: '⚽', color: '#f0fdfa' },
    { id: '8', name: 'Mobiles', slug: 'electronics', icon: '📲', color: '#f5f3ff' },
    { id: '9', name: 'Laptop', slug: 'electronics', icon: '💻', color: '#eff6ff' },
    { id: '10', name: 'Toys', slug: 'baby', icon: '🧸', color: '#fff7ed' },
  ];

  const categoriesToDisplay = (!categories || categories.length === 0) ? mockCategories : categories;

  return (
    <div className="w-full relative py-8 md:py-14 group max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 my-4">
      <div className="w-full flex items-center justify-between mb-8">
         <h2 className="text-xl md:text-3xl font-black text-noon-black uppercase tracking-tighter flex items-center gap-3">
            <span className="w-2 h-8 bg-noon-yellow rounded-full"></span>
            Explore Categories
         </h2>
      </div>
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".cat-next",
          prevEl: ".cat-prev",
        }}
        centeredSlides={false}
        centerInsufficientSlides={true}
        slidesPerView={4.2}
        spaceBetween={12}
        breakpoints={{
          360: { slidesPerView: 5.2, spaceBetween: 16 },
          480: { slidesPerView: 6.2, spaceBetween: 20 },
          640: { slidesPerView: 7.2, spaceBetween: 24 },
          1024: { slidesPerView: 8.5, spaceBetween: 28 },
          1280: { slidesPerView: 10, spaceBetween: 32 },
        }}
        className="w-full py-4 px-10"
      >
        {categoriesToDisplay.map((cat, idx) => (
          <SwiperSlide key={cat.id} className="animate-in fade-in slide-in-from-bottom-2 duration-700" style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}>
            <Link 
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center gap-3 cursor-pointer select-none group/item"
            >
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-[28%] flex items-center justify-center shadow-sm border border-black/[0.03] group-hover/item:shadow-xl group-hover/item:-translate-y-2 transition-all duration-500 relative bg-white overflow-hidden"
                style={{ 
                   background: `linear-gradient(180deg, ${cat.color || '#feeee2'} 0%, #fff 100%)`,
                   boxShadow: `0 4px 20px -5px ${cat.color || '#feeee2'}80`
                }}
              >
                {/* Shine effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-20" />
                
                <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 relative z-10 flex items-center justify-center">
                   {cat.icon?.startsWith('http') ? (
                     <Image 
                       src={cat.icon} 
                       fill 
                       alt={cat.name} 
                       className="object-contain p-2 transition-all duration-500 group-hover/item:scale-115 group-hover/item:rotate-3" 
                     />
                   ) : (
                     <div className="flex items-center justify-center h-full text-4xl group-hover/item:scale-125 transition-transform duration-500 group-hover/item:rotate-6 drop-shadow-sm">{cat.icon || "🏷️"}</div>
                   )}
                </div>

                {/* Glassy bottom border effect */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/50 backdrop-blur-sm" />
              </div>
              <span className="text-[12px] md:text-[13px] font-bold text-center leading-[1.2] text-zinc-900 group-hover/item:text-noon-black transition-colors px-1">
                {cat.name}
              </span>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons - Adjusted to stay inside or well-positioned */}
      <button className="cat-prev absolute left-2 top-1/2 -translate-y-[120%] z-20 w-11 h-11 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-xl text-gray-500 hover:text-noon-black hover:scale-105 transition-all opacity-0 group-hover:opacity-100 hidden md:flex backdrop-blur-md active:scale-95">
         <ChevronLeft size={24} />
      </button>
      <button className="cat-next absolute right-2 top-1/2 -translate-y-[120%] z-20 w-11 h-11 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-xl text-gray-500 hover:text-noon-black hover:scale-105 transition-all opacity-0 group-hover:opacity-100 hidden md:flex backdrop-blur-md active:scale-95">
         <ChevronRight size={24} />
      </button>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

export default function CategorySlider({ categories }: { categories: any[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full relative py-6 md:py-10 group overflow-visible">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".cat-next",
          prevEl: ".cat-prev",
        }}
        slidesPerView={3}
        spaceBetween={10}
        breakpoints={{
          480: { slidesPerView: 4.5, spaceBetween: 12 },
          640: { slidesPerView: 6.5, spaceBetween: 15 },
          1024: { slidesPerView: 8.5, spaceBetween: 20 },
          1280: { slidesPerView: 11, spaceBetween: 12 },
        }}
        className="px-2 md:px-0 !overflow-visible"
      >
        {categories.map((cat, idx) => (
          <SwiperSlide key={cat.id} className="animate-in fade-in slide-in-from-bottom-2 duration-700" style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}>
            <Link 
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center gap-3 cursor-pointer select-none group/item"
            >
              <div 
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-[28%] flex items-center justify-center shadow-sm border border-black/[0.03] group-hover/item:shadow-xl group-hover/item:-translate-y-2 transition-all duration-500 relative bg-white overflow-hidden"
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

      {/* Navigation Buttons - Enhanced and closer to premium style */}
      <button className="cat-prev absolute left-0 top-1/2 -translate-y-[120%] -translate-x-3 md:-translate-x-5 z-20 w-11 h-11 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-xl text-gray-500 hover:text-noon-black hover:scale-105 transition-all opacity-0 group-hover:opacity-100 hidden md:flex backdrop-blur-md active:scale-95">
         <ChevronLeft size={28} />
      </button>
      <button className="cat-next absolute right-0 top-1/2 -translate-y-[120%] translate-x-3 md:translate-x-5 z-20 w-11 h-11 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-xl text-gray-500 hover:text-noon-black hover:scale-105 transition-all opacity-0 group-hover:opacity-100 hidden md:flex backdrop-blur-md active:scale-95">
         <ChevronRight size={28} />
      </button>
    </div>
  );
}

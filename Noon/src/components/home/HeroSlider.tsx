"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const DEFAULT_BANNERS = [
  { id: '1', title: 'BIG SAVINGS', description: 'Up to 70% off on top electronics!', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200', color: 'bg-noon-yellow' },
  { id: '2', title: 'FASHION FAST', description: 'Trends that move at your speed.', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200', color: 'bg-rose-500' },
  { id: '3', title: 'BEAUTY BLISS', description: 'Revitalize your routine today.', image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200', color: 'bg-emerald-500' },
];

export default function HeroSlider({ collections }: { collections: any[] }) {
  const displayItems = collections.length > 0 ? collections.map(c => ({
    id: c.id,
    title: c.title,
    description: c.description || 'Exclusive deals just for you.',
    image: c.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
    color: 'bg-noon-black'
  })) : DEFAULT_BANNERS;

  return (
    <div className="w-full relative group h-[200px] sm:h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{
           nextEl: ".hero-next",
           prevEl: ".hero-prev",
        }}
        loop={true}
        className="h-full w-full"
      >
        {displayItems.map((item) => (
          <SwiperSlide key={item.id} className="h-full w-full relative">
            <Image 
               src={item.image} 
               alt={item.title} 
               fill 
               className="object-cover" 
               priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent flex items-center p-6 md:p-16">
              <div className="max-w-xl animate-in fade-in slide-in-from-left-10 duration-1000">
                 <h2 className="text-3xl md:text-6xl font-black mb-3 text-noon-yellow tracking-tighter uppercase italic">{item.title}</h2>
                 <p className="text-white/90 text-lg md:text-2xl font-medium mb-8 leading-tight drop-shadow-md">{item.description}</p>
                 <div className="flex gap-4">
                    <button className="bg-noon-yellow text-noon-black font-black px-8 py-3 rounded-md hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-xl uppercase tracking-widest text-sm">
                       Shop Now
                    </button>
                    <button className="bg-white/10 backdrop-blur-md text-white border border-white/30 font-bold px-8 py-3 rounded-md hover:bg-white/20 transition-all uppercase tracking-widest text-sm">
                       Learn More
                    </button>
                 </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Hero arrows */}
      <button className="hero-prev absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30">
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button className="hero-next absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30">
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

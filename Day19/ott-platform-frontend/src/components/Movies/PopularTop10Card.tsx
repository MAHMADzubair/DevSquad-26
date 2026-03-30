import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PopularTop10CardProps {
  title: string;
  images?: string[];
}

const PopularTop10Card: React.FC<PopularTop10CardProps> = ({ title, images = [] }) => {
  const dummyImg = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200&auto=format&fit=crop";
  const validImages = images.filter(Boolean);
  
  let displayImages = [];
  if (validImages.length > 0) {
     displayImages = Array.from({ length: 4 }, (_, i) => validImages[i % validImages.length]);
  } else {
     displayImages = [dummyImg, dummyImg, dummyImg, dummyImg];
  }
  
  return (
    <div 
      className="bg-[#1A1A1A] border border-[#262626] rounded-[12px] p-[30px] flex flex-col cursor-pointer hover:border-primary transition-all duration-300 group w-full h-full"
      style={{ minHeight: "342px", maxWidth: "296px" }}
    >
      {/* Image Grid Container */}
      <div className="relative isolate flex flex-col gap-[6px] w-full aspect-[236/238] mb-6 bg-[#141414] rounded-[10px] overflow-hidden shrink-0">
        <div className="flex flex-row gap-[6px] w-full h-1/2">
          <div className="flex-1 overflow-hidden">
             <img src={displayImages[0]} alt="movie" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
          </div>
          <div className="flex-1 overflow-hidden">
             <img src={displayImages[1]} alt="movie" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
          </div>
        </div>
        <div className="flex flex-row gap-[6px] w-full h-1/2">
          <div className="flex-1 overflow-hidden">
             <img src={displayImages[2]} alt="movie" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
          </div>
          <div className="flex-1 overflow-hidden">
             <img src={displayImages[3]} alt="movie" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
          </div>
        </div>
        
        {/* Fade Out Overlay - Subtle for full visibility */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none z-[1]" 
             style={{ background: "linear-gradient(180deg, rgba(26, 26, 26, 0) 0%, #1A1A1A 100%)" }} />
      </div>

      {/* Footer Container */}
      <div className="flex items-center justify-between gap-3 mt-auto relative z-[2]">
        <div className="flex flex-col gap-2 items-start max-w-[calc(100%-30px)]">
           <div className="bg-primary px-3 py-1 rounded-[5px] flex items-center justify-center">
             <span className="text-text-p text-[12px] font-bold leading-none uppercase tracking-tight">Top 10 In</span>
           </div>
           <h3 className="text-text-p text-[18px] font-semibold leading-tight line-clamp-1">{title}</h3>
        </div>
        <ArrowRight size={24} className="text-text-p opacity-80 group-hover:opacity-100 transition-all shrink-0 group-hover:translate-x-1 duration-300" />
      </div>
    </div>
  );
};

export default PopularTop10Card;

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
      className="bg-[#1A1A1A] border border-[#262626] rounded-[12px] p-4 lg:p-[30px] flex flex-col cursor-pointer hover:border-primary transition-all duration-300 group w-full h-full"
    >
      {/* Image Grid Container */}
      <div className="relative isolate flex flex-col gap-[6px] w-full aspect-[236/238] bg-[#141414] rounded-[10px] overflow-hidden shrink-0">
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
      <div className="flex items-center justify-between gap-2 mt-3 relative z-[2] w-full">
        <div className="flex items-center gap-2 max-w-[calc(100%-24px)] w-full overflow-hidden">
           <span className="bg-primary px-2 py-1 rounded-[4px] text-text-p text-[10px] md:text-[11px] font-bold leading-none uppercase tracking-wider whitespace-nowrap shrink-0">
             Top 10
           </span>
           <h3 className="text-text-p text-[14px] md:text-[16px] font-semibold leading-tight truncate">
             {title}
           </h3>
        </div>
        <ArrowRight size={18} className="text-text-p opacity-80 group-hover:opacity-100 transition-all shrink-0 group-hover:translate-x-1 duration-300" />
      </div>
    </div>
  );
};

export default PopularTop10Card;

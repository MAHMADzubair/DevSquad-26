import React from 'react';
import { Clock, Layers } from 'lucide-react';

interface TrendingCardProps {
  title?: string;
  image: string;
  duration?: string;
  views?: string;
  seasons?: string;
  isPremium?: boolean;
}

const TrendingCard: React.FC<TrendingCardProps> = ({ 
  title, 
  image, 
  duration = "1h 30m", 
  seasons = "1 Season", 
  isPremium = true 
}) => {
  return (
    <div 
      className="bg-[#1A1A1A] border border-[#262626] rounded-[12px] p-4 md:p-[20px] flex flex-col cursor-pointer hover:border-primary transition-all duration-300 group w-full h-full"
      style={{ minHeight: "342px", maxWidth: "296px" }}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[236/238] rounded-[10px] overflow-hidden mb-5 bg-[#141414] shrink-0">
        <img 
          src={image} 
          alt={title || "Movie poster"} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
        />
        {isPremium && (
          <div className="absolute top-2 right-2 z-10 w-10 h-10 bg-primary/90 backdrop-blur rounded-[8px] flex justify-center items-center shadow shadow-black/50">
            <span className="text-text-p text-[10px] font-bold uppercase tracking-widest rotate-90 scale-90">Pro</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#141414]/80 to-transparent pointer-events-none opacity-50 z-0" />
      </div>

      {/* Info Row - Twin Pills (No Title Layout) */}
      <div className="flex items-center justify-between gap-2 mt-auto relative z-10 w-full">
        {/* Duration Pill */}
        <div className="bg-[#141414] border border-[#262626] rounded-[30px] px-3 md:px-4 py-1.5 md:py-2 flex items-center gap-1.5 lg:gap-2 shadow-inner group-hover:border-[#333333] transition-colors overflow-hidden max-w-[50%]">
          <Clock size={16} className="text-[#999999] flex-shrink-0" />
          <span className="text-[#999999] text-[12px] md:text-[14px] font-medium leading-none whitespace-nowrap truncate">{duration}</span>
        </div>

        {/* Seasons / Parts Pill */}
        <div className="bg-[#141414] border border-[#262626] rounded-[30px] px-3 md:px-4 py-1.5 md:py-2 flex items-center gap-1.5 lg:gap-2 shadow-inner group-hover:border-[#333333] transition-colors overflow-hidden max-w-[50%]">
          <Layers size={16} className="text-[#999999] flex-shrink-0" />
          <span className="text-[#999999] text-[12px] md:text-[14px] font-medium leading-none whitespace-nowrap truncate">{seasons}</span>
        </div>
      </div>
    </div>
  );
};

export default TrendingCard;

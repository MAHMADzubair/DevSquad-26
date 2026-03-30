import React from 'react';
import { Clock } from 'lucide-react';

interface MustWatchCardProps {
  title: string;
  image: string;
  duration: string;
  views: string;
  isPremium?: boolean;
}

const MustWatchCard: React.FC<MustWatchCardProps> = ({ title, image, duration, views, isPremium = true }) => {
  return (
    <div className="bg-surface border border-border-darker rounded-[12px] p-3 md:p-4 flex flex-col cursor-pointer hover:border-primary transition-all group w-full h-full">
      {/* Image Container */}
      <div className="relative w-full aspect-[223/281] rounded-[10px] overflow-hidden mb-4 bg-bg-darker">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        {isPremium && (
          <div className="absolute top-2 right-2 z-10">
            <span className="bg-primary text-text-p text-[10px] font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-wider">Premium</span>
          </div>
        )}
      </div>

      {/* Footer Info Row */}
      <div className="flex flex-col gap-3 mt-auto">
        <h3 className="text-text-p text-[16px] md:text-[18px] font-bold truncate group-hover:text-primary transition-colors">{title}</h3>
        
        <div className="flex items-center justify-between gap-2 mt-auto">
          {/* Duration Pill */}
          <div className="bg-bg-custom border border-border-darker rounded-full px-3 py-1 flex items-center gap-1.5 overflow-hidden">
            <Clock size={14} className="text-text-s flex-shrink-0" />
            <span className="text-text-s text-[12px] md:text-[14px] font-medium leading-none whitespace-nowrap">{duration}</span>
          </div>

          {/* Rating/Views Pill */}
          <div className="bg-bg-custom border border-border-darker rounded-full px-3 py-1 flex items-center gap-1 overflow-hidden">
            <span className="text-primary text-[12px] shrink-0">★★★★</span>
            <span className="text-text-s text-[12px] md:text-[14px] font-medium leading-none whitespace-nowrap ml-0.5">{views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MustWatchCard;

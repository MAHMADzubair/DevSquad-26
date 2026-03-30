import React from 'react';
import { Play, Clock, Eye } from 'lucide-react';

interface SingleMovieCardProps {
  title: string;
  image: string;
  duration?: string;
  views?: string;
  isPremium?: boolean;
}

const SingleMovieCard: React.FC<SingleMovieCardProps> = ({ title, image, duration = "1h 30m", views = "2K", isPremium = true }) => {
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

        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center duration-300">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-300">
                <Play fill="currentColor" size={24} className="ml-1" />
            </div>
        </div>
      </div>
      
      {/* Info Content */}
      <div className="flex flex-col gap-3 mt-auto">
        <h3 className="text-text-p text-[16px] md:text-[18px] font-bold truncate group-hover:text-primary transition-colors">{title}</h3>
        
        <div className="flex items-center justify-between gap-2 mt-auto">
          {/* Duration Pill */}
          <div className="bg-bg-custom border border-border-darker rounded-full px-3 py-1 flex items-center gap-1.5 overflow-hidden">
            <Clock size={14} className="text-text-s flex-shrink-0" />
            <span className="text-text-s text-[12px] md:text-[14px] font-medium leading-none whitespace-nowrap">{duration}</span>
          </div>

          {/* View Count Pill */}
          <div className="bg-bg-custom border border-border-darker rounded-full px-3 py-1 flex items-center gap-1.5 overflow-hidden">
            <Eye size={14} className="text-text-s flex-shrink-0" />
            <span className="text-text-s text-[12px] md:text-[14px] font-medium leading-none whitespace-nowrap">{views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleMovieCard;

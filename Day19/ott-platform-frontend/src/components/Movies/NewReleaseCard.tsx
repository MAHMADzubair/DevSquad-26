import React from 'react';

interface NewReleaseCardProps {
  title: string;
  image: string;
  releaseDate: string;
  isPremium?: boolean;
}

const NewReleaseCard: React.FC<NewReleaseCardProps> = ({ title, image, releaseDate, isPremium = true }) => {
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

      {/* Release Info pill */}
      <div className="flex flex-col gap-3 mt-auto">
         <h3 className="text-text-p text-[16px] md:text-[18px] font-bold truncate group-hover:text-primary transition-colors">{title}</h3>
         
         <div className="bg-bg-custom border border-border-darker rounded-full px-4 py-2 flex items-center justify-center">
           <span className="text-text-s text-[12px] md:text-[14px] font-medium text-center truncate">
             Released at <span className="text-text-p ml-1 font-semibold">{releaseDate}</span>
           </span>
         </div>
      </div>
    </div>
  );
};

export default NewReleaseCard;

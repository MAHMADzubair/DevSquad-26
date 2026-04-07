"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageGallery({ images, productName, badge }: { images: string[], productName: string, badge?: string | null }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const displayImages = images.length > 0 ? images : ["https://via.placeholder.com/600?text=No+Image"];

  return (
    <div className="w-full md:w-1/3 flex flex-col gap-4">
      <div className="w-full aspect-square relative border border-gray-100 rounded-lg shrink-0 bg-white shadow-inner">
         <Image 
           src={displayImages[selectedIdx]} 
           alt={productName} 
           fill 
           className="object-contain p-4 transition-all duration-300" 
           priority 
         />
         {badge && (
           <div className="absolute top-4 left-4">
              <span className={`badge-${badge.toLowerCase().replace(' ', '')} text-[11px] px-2 py-1 shadow-sm`}>
                {badge}
              </span>
           </div>
         )}
      </div>
      
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
           {displayImages.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedIdx(i)}
                className={`w-16 h-16 relative border rounded shrink-0 cursor-pointer hover:border-noon-blue transition overflow-hidden ${i === selectedIdx ? 'border-noon-blue ring-1 ring-noon-blue shadow-md' : 'border-gray-100 opacity-70 hover:opacity-100'}`}
              >
                 <Image src={img} alt="" fill className="object-contain p-1" />
              </button>
           ))}
        </div>
      )}
    </div>
  );
}

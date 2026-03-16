import React from 'react';

const CollectionBanner = ({ categoryName, categoryImage }) => {
  const defaultBanner = "/Rectangle 2.png";
  
  return (
    <div className="w-full h-48 md:h-64 lg:h-[400px] relative overflow-hidden bg-gray-200">
      <img 
        src={categoryImage || defaultBanner}
        alt={categoryName || "Tea Collection"}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default CollectionBanner;

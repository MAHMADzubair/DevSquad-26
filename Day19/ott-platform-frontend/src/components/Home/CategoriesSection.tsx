import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

interface CategoriesSectionProps {
  title?: string;
  description?: string;
  showContainer?: boolean;
  genreData?: any[]; // For passing grouped movies from parent
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  title = "Explore our wide variety of categories",
  description = "Whether you're looking for a comedy to make you laugh, a drama to make you think, or a documentary to learn something new",
  showContainer = true,
  genreData
}) => {
  const navigate = useNavigate();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const { data, isLoading: queryLoading } = useQuery({
    queryKey: ['publicCategories'],
    enabled: !genreData, // Only fetch if data wasn't passed in
    queryFn: async () => {
      const { data } = await api.get('/movies/categories?isActive=true&limit=10');
      return data;
    },
  });

  const categories = genreData || data?.results || [];
  const isLoading = !genreData && queryLoading;

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/movies?genre=${categoryId}`);
  };

  const dummyImg = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=300&auto=format&fit=crop";

  const content = (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-[50px] md:gap-[100px]">
        {/* Header content... (same as before) */}
        <div className="flex flex-col w-full md:max-w-[1141px]">
          <h2 className="text-[24px] md:text-[38px] font-bold text-text-p leading-tight">
            {title}
          </h2>
          {description && (
            <p className="text-[14px] md:text-[18px] text-[#999999] font-normal mt-2 md:mt-3 line-clamp-2 md:line-clamp-none">
              {description}
            </p>
          )}
        </div>
        
        {/* Desktop Header Controls (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-3 bg-[#0F0F0F] p-3 rounded-[8px] border border-[#1A1A1A] shadow-lg">
          <button className="category-prev w-10 h-10 md:w-12 md:h-12 bg-[#1A1A1A] border border-[#1F1F1F] rounded-[8px] flex items-center justify-center text-text-p hover:bg-[#262626] transition-colors disabled:opacity-50 cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-[3px]">
            {Array.from({ length: Math.ceil(categories.length / 5) }).map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-300 ${
                  Math.floor(activeSlideIndex / 5) === i 
                    ? "w-[23px] bg-primary" 
                    : "w-[12px] bg-[#333333]"
                }`}
              />
            ))}
          </div>
          <button className="category-next w-10 h-10 md:w-12 md:h-12 bg-[#1A1A1A] border border-[#1F1F1F] rounded-[8px] flex items-center justify-center text-text-p hover:bg-[#262626] transition-colors disabled:opacity-50 cursor-pointer">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <div className="mt-[50px]">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-[15px] xl:gap-[30px]">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-surface border border-border-darker rounded-[12px] p-[30px] h-[300px] animate-pulse">
                <div className="grid grid-cols-2 gap-[5px] h-full opacity-20">
                  <div className="bg-border-darker rounded-[10px]" />
                  <div className="bg-border-darker rounded-[10px]" />
                  <div className="bg-border-darker rounded-[10px]" />
                  <div className="bg-border-darker rounded-[10px]" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="py-20 text-center text-text-s italic opacity-50 border border-dashed border-border-darker rounded-[12px]">
             No categories available at the moment.
          </div>
        ) : (
          <Swiper
            modules={[Navigation]}
            spaceBetween={15}
            slidesPerView={2}
            slidesPerGroup={2}
            navigation={{
              prevEl: '.category-prev',
              nextEl: '.category-next',
            }}
            onSlideChange={(swiper) => setActiveSlideIndex(swiper.activeIndex)}
            breakpoints={{
              480: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 25 },
              1024: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 30 },
              1536: { slidesPerView: 5, slidesPerGroup: 5, spaceBetween: 30 },
            }}
            className="mySwiper"
          >
            {categories.map((category: any, idx: number) => {
              // Extract the valid images from the category
              const validImages = (category.images || [category.thumbnail]).filter(Boolean);
              
              // If we have at least 1 valid image, loop it to fill 4 slots. If none, then fallback to dummy.
              let displayImages = [];
              if (validImages.length > 0) {
                 displayImages = Array.from({ length: 4 }, (_, i) => validImages[i % validImages.length]);
              } else {
                 displayImages = [dummyImg, dummyImg, dummyImg, dummyImg];
              }

              return (
                <SwiperSlide key={category.id || idx} className="!h-auto">
                  <div
                    onClick={() => handleCategoryClick(category.id || category.title)}
                    className="bg-[#1A1A1A] border border-[#262626] rounded-[12px] p-[20px] md:p-[30px] flex flex-col cursor-pointer hover:border-primary transition-all duration-300 group h-full select-none"
                    style={{ minHeight: "342px", width: "100%", maxWidth: "296px" }}
                  >
                    {/* Image Grid - Container for the 4 thumbnails */}
                    <div className="relative isolate flex flex-col gap-[6px] w-full aspect-[236/238] mb-6 bg-[#141414] rounded-[10px] overflow-hidden shrink-0">
                      <div className="w-full h-full overflow-hidden">
                        <img src={displayImages[0]} alt="movie" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                      </div>
                      
                      {/* Subtle Fade - for full picture visibility */}
                      <div 
                        className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none z-[1]"
                        style={{ background: "linear-gradient(180deg, rgba(26, 26, 26, 0) 0%, #1A1A1A 100%)" }}
                      />
                    </div>

                    {/* Footer - Category Title & Arrow icon */}
                    <div className="flex items-center justify-between z-[2] mt-auto">
                      <span className="text-[18px] font-semibold text-text-p truncate pr-2 leading-none">
                        {category.name || category.title}
                      </span>
                      <ArrowRight size={24} className="text-text-p opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0 group-hover:translate-x-1 duration-300" />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>

      {/* Mobile Pagination Indicators (Hidden on Desktop) */}
      {!isLoading && categories.length > 0 && (
        <div className="flex md:hidden justify-center items-center gap-[4px] mt-8 mb-4">
          {Array.from({ length: Math.ceil(categories.length / 2) }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                Math.floor(activeSlideIndex / 2) === i 
                  ? "w-[23px] bg-primary" 
                  : "w-[12px] bg-[#333333]"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );

  return (
    <section className={`w-full ${showContainer ? "mt-[40px] md:mt-[60px]" : ""}`}>
      {showContainer ? (
        <div className="w-full max-w-[1920px] mx-auto px-[15px] laptop:px-[80px] desktop:px-[162px]">
          {content}
        </div>
      ) : content}
    </section>
  );
};

export default CategoriesSection;

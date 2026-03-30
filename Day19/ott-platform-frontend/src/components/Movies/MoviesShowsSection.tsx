import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

const movieCategories = [
  {
    title: 'Action',
    images: [
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1489599848827-30998a83c8a9?w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1440404809759-8e5777763241?w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1478720568257-3dab4b4e2f4a?w=300&auto=format&fit=crop',
    ],
  },
  {
    title: 'Adventure',
    images: [
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1489599848827-30998a83c8a9?w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1440404809759-8e5777763241?w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1478720568257-3dab4b4e2f4a?w=300&auto=format&fit=crop',
    ],
  },
  {
    title: 'Comedy',
    images: [
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1489599848827-30998a83c8a9?w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1440404809759-8e5777763241?w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1478720568257-3dab4b4e2f4a?w=300&auto=format&fit=crop',
    ],
  },
  {
    title: 'Drama',
    tag: 'New',
    images: [
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1489599848827-30998a83c8a9?w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1440404809759-8e5777763241?w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1478720568257-3dab4b4e2f4a?w=300&auto=format&fit=crop',
    ],
  },
  {
    title: 'Horror',
    images: [
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1489599848827-30998a83c8a9?w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1440404809759-8e5777763241?w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1478720568257-3dab4b4e2f4a?w=300&auto=format&fit=crop',
    ],
  },
];

const MoviesShowsSection: React.FC = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  return (
    <section className="w-full mt-[50px] md:mt-[100px]">
      <div className="w-full max-w-[1920px] mx-auto px-[15px] laptop:px-[80px] desktop:px-[162px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-[50px] gap-5">
          <h2 className="text-[28px] md:text-[38px] font-bold text-text-p">
            Movies & Shows
          </h2>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-4 bg-surface p-4 rounded-[12px] border border-border-custom">
            <button 
              className="movies-prev w-14 h-14 bg-bg-custom border border-border-custom rounded-[8px] flex items-center justify-center text-text-p hover:bg-border-custom transition-colors disabled:opacity-50"
            >
              <ArrowLeft size={24} />
            </button>
            
            {/* Indicators */}
            <div className="flex gap-1">
              {movieCategories.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === activeSlideIndex 
                      ? 'w-[23px] bg-primary' 
                      : 'w-[16px] bg-border-custom'
                  }`}
                />
              ))}
            </div>
            
            <button 
              className="movies-next w-14 h-14 bg-bg-custom border border-border-custom rounded-[8px] flex items-center justify-center text-text-p hover:bg-border-custom transition-colors disabled:opacity-50"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>

        {/* Swiper Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            slidesPerGroup={1}
            navigation={{
              prevEl: '.movies-prev',
              nextEl: '.movies-next',
            }}
            onSlideChange={(swiper) => setActiveSlideIndex(swiper.activeIndex)}
            breakpoints={{
              480: {
                slidesPerView: 2,
                slidesPerGroup: 2,
              },
              1024: {
                slidesPerView: 3,
                slidesPerGroup: 3,
              },
              1280: {
                slidesPerView: 4,
                slidesPerGroup: 4,
              },
              1536: {
                slidesPerView: 5,
                slidesPerGroup: 5,
              },
            }}
            className="mySwiper"
          >
            {movieCategories.map((category, idx) => (
              <SwiperSlide key={idx}>
                <MovieCard 
                  title={category.title}
                  tag={category.tag}
                  images={category.images}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default MoviesShowsSection;

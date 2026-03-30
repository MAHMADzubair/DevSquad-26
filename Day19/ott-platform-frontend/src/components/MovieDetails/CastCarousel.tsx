import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

interface CastCarouselProps {
  cast: {
    name: string;
    image?: string;
  }[];
}

const CastCarousel: React.FC<CastCarouselProps> = ({ cast }) => {
  if (!cast || cast.length === 0) {
    return (
      <div className="w-full bg-surface border border-border-darker rounded-[12px] p-[24px] xl:p-[40px]">
        <h3 className="text-text-s font-medium text-[16px] xl:text-[18px] mb-4">Cast</h3>
        <p className="text-text-s text-[14px]">No cast information available.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-surface border border-border-darker rounded-[12px] p-[24px] xl:p-[40px] flex flex-col gap-[30px] xl:gap-[40px]">
      {/* Header */}
      <div className="flex flex-row items-center justify-between w-full">
        <h3 className="text-text-s font-medium text-[16px] xl:text-[18px]">Cast</h3>
        <div className="flex flex-row gap-[10px] xl:gap-[16px]">
          <button className="cast-prev w-[44px] h-[44px] xl:w-[56px] xl:h-[56px] rounded-full bg-bg-custom border border-border-darker flex justify-center items-center text-text-p hover:bg-border-darker transition-colors cursor-pointer disabled:opacity-50">
            <ArrowLeft className="w-[20px] h-[20px] xl:w-[28px] xl:h-[28px]" />
          </button>
          <button className="cast-next w-[44px] h-[44px] xl:w-[56px] xl:h-[56px] rounded-full bg-bg-custom border border-border-darker flex justify-center items-center text-text-p hover:bg-border-darker transition-colors cursor-pointer disabled:opacity-50">
            <ArrowRight className="w-[20px] h-[20px] xl:w-[28px] xl:h-[28px]" />
          </button>
        </div>
      </div>

      {/* Cast Swiper Slider */}
      <div className="w-full relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={3}
          navigation={{
            prevEl: '.cast-prev',
            nextEl: '.cast-next',
          }}
          breakpoints={{
            480: { slidesPerView: 4, spaceBetween: 15 },
            768: { slidesPerView: 5, spaceBetween: 20 },
            1024: { slidesPerView: 6, spaceBetween: 20 },
            1280: { slidesPerView: 8, spaceBetween: 20 },
          }}
          className="mySwiper !overflow-visible"
        >
          {cast.map((actor, idx) => (
            <SwiperSlide key={actor.name + idx}>
              <div className="flex flex-col gap-2 group">
                <div className="w-full aspect-square rounded-[10px] overflow-hidden bg-bg-darker border border-border-darker flex items-center justify-center">
                  {actor.image ? (
                    <img src={actor.image} alt={actor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <span className="text-[24px]">👤</span>
                  )}
                </div>
                <p className="text-[12px] text-center text-text-s font-medium truncate w-full">{actor.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CastCarousel;

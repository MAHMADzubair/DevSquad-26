import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SingleMovieCard from "./SingleMovieCard";
import NewReleaseCard from "./NewReleaseCard";
import PopularTop10Card from "./PopularTop10Card";
import MustWatchCard from "./MustWatchCard";
import TrendingCard from "./TrendingCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

interface Movie {
  id: string | number;
  title: string;
  image: string;
  duration?: string;
  views?: string;
  releaseDate?: string;
  seasons?: string;
  isPremium?: boolean;
  images?: string[];
}

interface ContentRowProps {
  title: string;
  movies: Movie[];
  variant?: "standard" | "new-release" | "top-10" | "must-watch" | "trending";
}

const ContentRow: React.FC<ContentRowProps> = ({ 
  title, 
  movies, 
  variant = "standard" 
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Generate unique class names for navigation to avoid conflicts between multiple rows
  const idSuffix = title.replace(/\s+/g, '-').toLowerCase();
  const prevClass = `prev-${idSuffix}`;
  const nextClass = `next-${idSuffix}`;

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-[50px] gap-4">
        <h2 className="text-[24px] md:text-[32px] font-bold text-text-p leading-tight">
          {title}
        </h2>

        {/* Navigation Controls Group (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-3 bg-[#0F0F0F] p-3 rounded-[8px] border border-[#1A1A1A] shadow-lg">
          <button
            className={`${prevClass} w-10 h-10 md:w-12 md:h-12 bg-[#1A1A1A] border border-[#1F1F1F] rounded-[8px] flex items-center justify-center text-text-p hover:bg-[#262626] transition-colors disabled:opacity-50 cursor-pointer`}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex gap-[3px]">
            {Array.from({ length: Math.ceil(movies.length / 5) || 1 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  Math.floor(activeSlideIndex / 5) === idx
                    ? "w-[23px] bg-primary"
                    : "w-[12px] bg-[#333333]"
                }`}
              />
            ))}
          </div>

          <button
            className={`${nextClass} w-10 h-10 md:w-12 md:h-12 bg-[#1A1A1A] border border-[#1F1F1F] rounded-[8px] flex items-center justify-center text-text-p hover:bg-[#262626] transition-colors disabled:opacity-50 cursor-pointer`}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={15}
          slidesPerView={2}
          slidesPerGroup={2}
          navigation={{
            prevEl: `.${prevClass}`,
            nextEl: `.${nextClass}`,
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
          {movies.map((movie) => {
            const cardId = movie.id || (movie as any)._id;
            let CardComponent;

            if (variant === "top-10") {
              CardComponent = <PopularTop10Card title={movie.title} images={movie.images} />;
            } else if (variant === "trending") {
              CardComponent = (
                <TrendingCard
                  title={movie.title}
                  image={movie.image}
                  duration={movie.duration || "1h 30m"}
                  seasons={movie.seasons || "1 Season"}
                  isPremium={movie.isPremium}
                />
              );
            } else if (variant === "must-watch") {
              CardComponent = (
                <MustWatchCard
                  title={movie.title}
                  image={movie.image}
                  duration={movie.duration || "1h 30m"}
                  views={movie.views || "2K"}
                  isPremium={movie.isPremium}
                />
              );
            } else if (variant === "new-release") {
              CardComponent = (
                <NewReleaseCard
                  title={movie.title}
                  image={movie.image}
                  releaseDate={movie.releaseDate || "14 April 2023"}
                  isPremium={movie.isPremium}
                />
              );
            } else {
              CardComponent = (
                <SingleMovieCard
                  title={movie.title}
                  image={movie.image}
                  duration={movie.duration}
                  views={movie.views}
                  isPremium={movie.isPremium}
                />
              );
            }

            return (
              <SwiperSlide key={cardId} className="!h-auto">
                <Link to={`/movies/${cardId}`} className="block transition-transform hover:scale-[1.02] h-full">
                  {CardComponent}
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Mobile Pagination Indicators (Hidden on Desktop) */}
      <div className="flex md:hidden justify-center items-center gap-[4px] mt-8 mb-4">
        {Array.from({ length: Math.ceil(movies.length / 2) || 1 }).map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              Math.floor(activeSlideIndex / 2) === idx
                ? "w-[23px] bg-primary"
                : "w-[12px] bg-[#333333]"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default ContentRow;

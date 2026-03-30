import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { data: moviesData } = useQuery({
    queryKey: ['heroMovies'],
    queryFn: async () => {
      const { data } = await api.get('/movies?limit=20');
      return data;
    },
  });

  const movies = moviesData?.results || [];
  
  // Create a multi-row marquee from fetched movies
  const row1 = [...movies].slice(0, 10);
  const row2 = [...movies].slice(5, 15);
  const row3 = [...movies].slice(10, 20);
  const row4 = [...movies].slice(0, 10).reverse();

  const MarqueeRow = ({ items, direction }: { items: any[], direction: 'left' | 'right' }) => (
    <div className={`flex flex-row gap-[20px] w-max ${direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'}`}>
      {[...items, ...items, ...items].map((movie, i) => (
        <img 
          key={`${movie.id}-${i}`} 
          src={movie.posterUrl} 
          className="w-[195px] h-[200px] rounded-[12px] object-cover" 
          alt={movie.title} 
        />
      ))}
    </div>
  );

  return (
    <section className="relative w-full min-h-[600px] md:min-h-[860px] desktop:min-h-[1092px] flex flex-col justify-end items-center overflow-hidden bg-bg-custom mt-[0px] md:mt-[-64px] mb-[64px]">
      {/* Background Marquees */}
      <div className="absolute inset-x-0 top-0 h-full flex flex-col gap-[20px] py-[20px] opacity-20 pointer-events-none">
        {row1.length > 0 && (
          <>
            <MarqueeRow items={row1} direction="left" />
            <MarqueeRow items={row2} direction="right" />
            <MarqueeRow items={row3} direction="left" />
            <MarqueeRow items={row4} direction="right" />
          </>
        )}
      </div>

      {/* Fade Overlays */}
      <div className="absolute top-0 inset-x-0 h-[300px] md:h-[580px] bg-gradient-to-b from-bg-custom to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 inset-x-0 h-[300px] md:h-[580px] bg-gradient-to-t from-transparent to-bg-custom z-10 pointer-events-none"></div>

      {/* Center Logo */}
      <div className="absolute top-[35%] xl:top-[38%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <img src="/logo.svg" alt="Netixsol Logo Background" className="w-[250px] h-[250px] desktop:w-[470px] desktop:h-[470px] opacity-80" />
      </div>

      {/* Bottom Content Container */}
      <div className="relative z-30 w-full max-w-[1920px] mx-auto px-[15px] xl:px-[412px] flex flex-col items-center text-center gap-[20px] md:gap-[50px] pb-[20px] md:pb-[40px]">
        <div className="flex flex-col gap-[10px] md:gap-[14px] items-center">
          <h1 className="text-[28px] sm:text-[32px] md:text-[58px] font-bold text-text-p leading-[1.2] text-center max-w-[300px] md:max-w-none">
            The Best Streaming Experience
          </h1>
          <p className="text-[14px] md:text-[18px] text-[#999999] font-normal max-w-[1096px] leading-[1.5] text-center">
            Netixsol is the best streaming experience for watching your favorite movies and shows on demand, anytime, anywhere. With Netixsol, you can enjoy a wide variety of content, including the latest blockbusters, classic movies, popular TV shows, and more.
          </p>
        </div>
        <button 
          onClick={() => navigate('/movies')}
          className="flex flex-row items-center justify-center gap-[4px] px-[20px] md:px-[24px] py-[14px] md:py-[18px] bg-primary text-text-p font-semibold text-[16px] md:text-[18px] rounded-[8px] hover:bg-red-700 transition-colors cursor-pointer min-h-[50px] md:h-[64px] min-w-[200px] md:min-w-[251px]"
        >
          <Play fill="currentColor" size={24} className="md:w-[28px] md:h-[28px]" />
          Start Watching Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;

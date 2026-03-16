import React from 'react';
import heroImg from '../../assets/homepage_hero.png';

const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row h-auto md:h-[600px] w-full">
      <div className="md:w-1/2 w-full h-[450px] md:h-full bg-gray-200">
        <img 
          src={heroImg} 
          alt="Spoons with various tea leaves on a marble surface"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="md:w-1/2 w-full flex flex-col justify-center px-10 py-16 md:px-24 bg-[var(--color-brand-bg)]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-[var(--color-brand-primary)] mb-8">
          Every day is unique,<br />just like our tea
        </h1>
        
        <div className="text-[11px] font-medium leading-[145%] tracking-[0.5px] text-[#282828] mb-6 space-y-4 max-w-sm">
          <p>
            Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus adipiscing odio. Neque lacus nibh eros in.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus adipiscing odio. Neque lacus nibh eros in.
          </p>
        </div>

        <button className="bg-[#282828] text-white w-48 h-12 text-[11px] font-bold tracking-[2.5px] hover:bg-black transition-colors mt-4 uppercase">
          BROWES TEAS
        </button>
      </div>
    </section>
  );
};

export default Hero;

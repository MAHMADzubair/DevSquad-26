import React from 'react';

import HeroSection from '../components/Home/HeroSection';
import CategoriesSection from '../components/Home/CategoriesSection';
import DevicesSection from '../components/Home/DevicesSection';
import FAQSection from '../components/Home/FAQSection';
import PricingSection from '../components/Home/PricingSection';
import CTASection from '../components/Home/CTASection';

const HomePage: React.FC = () => {

  return (
    <div className="w-full bg-bg-custom flex flex-col items-center">
      <HeroSection />
      
      <div className="w-full max-w-[1920px] mx-auto flex flex-col gap-[80px] md:gap-[120px] pb-[100px]">
        <CategoriesSection showContainer={true} />



        <DevicesSection />
        <FAQSection />
        <PricingSection />
      </div>

      <CTASection />
    </div>
  );
};

export default HomePage;

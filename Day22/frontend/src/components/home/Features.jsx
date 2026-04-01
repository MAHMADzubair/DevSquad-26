import React from 'react';
import { Coffee, Award, Truck, Tag } from 'lucide-react';

const Features = () => {
  const features = [
    { icon: <Coffee size={20} strokeWidth={1.5} />, label: "450+ KIND OF LOOSEF TEA" },
    { icon: <Award size={20} strokeWidth={1.5} />, label: "CERTIFICATED ORGANIC TEAS" },
    { icon: <Truck size={20} strokeWidth={1.5} />, label: "FREE DELIVERY" },
    { icon: <Tag size={20} strokeWidth={1.5} />, label: "SAMPLE FOR ALL TEAS" }
  ];

  return (
    <section className="bg-[var(--color-brand-surface)] w-full flex flex-col items-center py-12">
      <div className="flex flex-wrap items-center justify-around w-full max-w-7xl mb-10 px-8 gap-y-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-3 text-[var(--color-brand-primary)]">
            {feature.icon}
            <span className="text-[11px] font-medium tracking-[0.5px] uppercase">{feature.label}</span>
          </div>
        ))}
      </div>
      
      <button className="border border-[var(--color-brand-outline)] bg-transparent text-[var(--color-brand-primary)] w-48 h-12 text-[11px] font-medium tracking-[0.5px] uppercase hover:bg-white transition-colors">
        LEARN MORE
      </button>
    </section>
  );
};

export default Features;

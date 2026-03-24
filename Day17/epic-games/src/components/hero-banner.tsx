import React from 'react';

export default function HeroBanner() {
  return (
    <section className="w-full h-[400px] md:h-[600px] bg-surface-dim rounded-xl overflow-hidden relative my-6">
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center px-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Epic Winter Sale</h2>
        <p className="text-white/80 text-lg max-w-md mb-8">Save up to 75% on selected titles this winter season.</p>
        <button className="w-fit px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors uppercase text-sm">
          Shop Now
        </button>
      </div>
    </section>
  );
}
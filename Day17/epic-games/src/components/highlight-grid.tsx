import React from 'react';

export default function HighlightGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
      {[1, 2, 3].map((i) => (
        <div key={i} className="aspect-video bg-surface-dim rounded-lg overflow-hidden group cursor-pointer relative">
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white font-bold">Featured Title {i}</h3>
          </div>
        </div>
      ))}
    </section>
  );
}
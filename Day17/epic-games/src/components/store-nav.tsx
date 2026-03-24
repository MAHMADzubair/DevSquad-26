import React from 'react';

export default function StoreNav() {
  const links = ['Discover', 'Browse', 'News'];
  
  return (
    <nav className="flex items-center gap-8 py-6 sticky top-0 bg-primary z-40">
      {links.map((link) => (
        <a 
          key={link} 
          href="#" 
          className="text-text-dim hover:text-text-active transition-colors font-normal text-sm uppercase tracking-wider"
        >
          {link}
        </a>
      ))}
    </nav>
  );
}

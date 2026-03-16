import React from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import CollectionsGrid from '../components/home/CollectionsGrid';

const HomePage = () => {
  return (
    <main className="flex-1 flex flex-col">
      <Hero />
      <Features />
      <CollectionsGrid />
    </main>
  );
};

export default HomePage;

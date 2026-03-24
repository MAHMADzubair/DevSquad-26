import React from 'react';
import StoreNav from "@/components/store-nav";
import Footer from "@/components/footer";
import ExploreCatalog from "@/components/explore-catalog";

export default function GamesPage() {
  return (
    <div className="px-5 md:px-[60px] lg:px-[100px] xl:px-[181px] min-h-screen flex flex-col bg-primary text-text-active">
      <StoreNav />
      <main className="flex-grow py-12">
        <h1 className="text-4xl font-normal mb-8 uppercase tracking-tight">Browse Catalog</h1>
        <ExploreCatalog />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-12">
           {/* This could be populated by a fetch from /api/games */}
           {[...Array(12)].map((_, i) => (
             <div key={i} className="flex flex-col gap-3 group cursor-pointer">
               <div className="aspect-[3/4] bg-surface-dim rounded-md overflow-hidden transition-transform group-hover:scale-[1.02]" />
               <div className="h-4 w-3/4 bg-surface-dim rounded mb-1 animate-pulse" />
               <div className="h-3 w-1/4 bg-surface-dim rounded animate-pulse" />
             </div>
           ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

import React from 'react';
import StoreNav from "@/components/store-nav";
import Footer from "@/components/footer";

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gameName = decodeURIComponent(id);

  return (
    <div className="px-5 md:px-[60px] lg:px-[100px] xl:px-[181px] min-h-screen flex flex-col bg-primary text-text-active">
      <StoreNav />
      <main className="flex-grow py-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-normal mb-6">{gameName}</h1>
          <div className="w-full aspect-video bg-surface-dim rounded-lg mb-8 animate-pulse"></div>
          <p className="text-text-dim text-lg leading-relaxed">
            This is the detail page for {gameName}. Integration with the store data will allow you to see more details here.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

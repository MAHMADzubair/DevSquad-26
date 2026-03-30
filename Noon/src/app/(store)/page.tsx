import CategorySlider from "@/components/home/CategorySlider";
import ProductCard from "@/components/product/ProductCard";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getHomePageData() {
  const collections = await prisma.collection.findMany({
    where: { showOnHome: true },
    include: { products: true },
    orderBy: { order: "asc" }
  });

  const electronics = await prisma.product.findMany({
    where: { category: { slug: "electronics" } },
    take: 6,
    orderBy: { reviewCount: "desc" },
  });
  
  const bestSellers = await prisma.product.findMany({
    take: 12,
    orderBy: { reviewCount: "desc" },
  });

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" }
  });
  
  return { electronics, bestSellers, collections, categories };
}

export default async function Home() {
  const { electronics, bestSellers, collections, categories } = await getHomePageData();

  return (
    <div className="w-full pb-10 pt-4 flex flex-col gap-6 md:gap-10 page-enter px-4 md:px-0">
      
      {/* Dynamic Collection Banners (Hero) */}
      {collections.filter(c => c.imageUrl).map(collection => (
        <div key={collection.id} className="w-full h-[150px] sm:h-[250px] md:h-[350px] relative rounded-lg overflow-hidden cursor-pointer group shadow-lg">
           <Image 
              src={collection.imageUrl!}
              alt={collection.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-8 md:p-12">
              <div className="text-white">
                 <h2 className="text-3xl md:text-5xl font-black mb-2 shadow-sm text-noon-yellow tracking-tight uppercase italic">{collection.title}</h2>
                 <p className="text-lg md:text-xl font-medium shadow-sm mb-4 max-w-lg">{collection.description}</p>
                 <button className="bg-noon-yellow text-noon-black font-black px-8 py-2.5 rounded shadow-xl hover:bg-white transition uppercase text-sm tracking-widest">Shop Collection</button>
              </div>
           </div>
        </div>
      ))}

      {/* Hero Banner Grid (Original) */}
      {!collections.some(c => c.imageUrl) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 h-[200px] sm:h-[300px] md:h-[400px] relative rounded-lg overflow-hidden cursor-pointer group">
            <Image 
               src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200"
               alt="Ramadan Sale Banner"
               fill
               className="object-cover transition-transform duration-500 group-hover:scale-105"
               priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8 md:p-12">
               <div className="text-white">
                  <h2 className="text-3xl md:text-5xl font-black mb-2 shadow-sm text-noon-yellow">BIG<br/>SAVINGS</h2>
                  <p className="text-lg md:text-xl font-medium shadow-sm mb-4">Up to 70% off on top electronics!</p>
                  <button className="bg-noon-yellow text-noon-black font-bold px-6 py-2 rounded shadow-md hover:bg-white transition">Shop Now</button>
               </div>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col gap-4">
             <div className="flex-1 relative rounded-lg overflow-hidden cursor-pointer"><Image src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600" alt="" fill className="object-cover" /><div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4"><span className="bg-white/90 text-noon-black px-4 py-2 font-black rounded backdrop-blur">NEW DROPS</span></div></div>
             <div className="flex-1 relative rounded-lg overflow-hidden cursor-pointer"><Image src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600" alt="" fill className="object-cover" /><div className="absolute inset-0 bg-black/30 flex items-end p-4"><span className="text-white font-black text-xl w-full">BEAUTY DEALS<br/><span className="text-sm font-medium">Extra 20% Off</span></span></div></div>
          </div>
        </div>
      )}

      {/* Circle Categories Quick Links (Dynamic Slider) */}
      <CategorySlider categories={categories} />

      {/* Dynamic Collections Rows */}
      {collections.map((coll) => (
        <div key={coll.id}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-black text-noon-black uppercase tracking-tight flex items-center gap-3">
               <span className="w-1.5 h-6 bg-noon-yellow rounded-full"></span>
               {coll.title}
            </h2>
            <button className="text-xs font-black bg-white border border-gray-200 px-5 py-2 rounded hover:bg-gray-50 flex items-center gap-2 transition uppercase">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
             {coll.products.slice(0, 12).map((product) => (
               <ProductCard key={product.id} product={product} />
             ))}
          </div>
        </div>
      ))}

      {/* Default Rows if no collections */}
      {collections.length === 0 && (
        <>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-black text-noon-black">Recommended for you</h2>
              <button className="text-sm font-bold bg-white border border-gray-300 px-4 py-1.5 rounded hover:bg-gray-50 flex items-center gap-2 transition">View All</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {electronics.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 border-t-4 border-t-noon-yellow">
            <h2 className="text-xl md:text-2xl font-black text-noon-black mb-6 flex items-center gap-2">
               <span className="text-2xl">🔥</span> Trending Best Sellers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 bg-zinc-100 p-8 rounded-lg my-4 text-center border-y border-black/5">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md border border-black/5"><span className="text-2xl">⚡</span></div>
          <h4 className="font-extrabold text-lg uppercase tracking-tight">Fast Delivery</h4>
          <p className="text-xs text-gray-400 max-w-[200px] font-medium">Get your items faster with noon express</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md border border-black/5"><span className="text-2xl">🛡️</span></div>
          <h4 className="font-extrabold text-lg uppercase tracking-tight">Secure Payments</h4>
          <p className="text-xs text-gray-400 max-w-[200px] font-medium">100% secure payment with advanced encryption</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md border border-black/5"><span className="text-2xl">🔄</span></div>
          <h4 className="font-extrabold text-lg uppercase tracking-tight">Easy Returns</h4>
          <p className="text-xs text-gray-400 max-w-[200px] font-medium">Return items within 15 days hassle-free</p>
        </div>
      </div>
    </div>
  );
}


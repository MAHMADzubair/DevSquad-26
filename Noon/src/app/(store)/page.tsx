import HeroSlider from "@/components/home/HeroSlider";
import CategorySlider from "@/components/home/CategorySlider";
import ProductCard from "@/components/product/ProductCard";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getHomePageData() {
  try {
    const collections = await prisma.collection.findMany({
      where: { showOnHome: true },
      include: { products: true, _count: { select: { products: true } } },
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
      take: 20,
      orderBy: { name: "asc" }
    });
    
    return { electronics, bestSellers, collections, categories };
  } catch (error) {
    console.error("Home page data error:", error);
    return { electronics: [], bestSellers: [], collections: [], categories: [] };
  }
}

export default async function Home() {
  const { electronics, bestSellers, collections, categories } = await getHomePageData();

  return (
    <div className="w-full pb-10 pt-4 flex flex-col gap-14 md:gap-24 page-enter px-4 md:px-6">
      
      {/* Hero Swiper Slider */}
      <HeroSlider collections={collections} />

      {/* Circle Categories Quick Links (Dynamic Slider) */}
      <CategorySlider categories={categories} />

      {/* Dynamic Collections Rows */}
      {collections.map((coll) => (
        <div key={coll.id}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-black text-noon-black uppercase tracking-tight flex items-center gap-3">
               <span className="w-1.5 h-6 bg-noon-yellow rounded-full"></span>
               {coll.title}
            </h2>
            <button className="text-xs font-black bg-white border border-gray-200 px-5 py-2 rounded hover:bg-gray-50 flex items-center gap-2 transition uppercase">View All</button>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
             {coll.products.slice(0, 12).map((product) => (
               <div key={product.id} className="w-[160px] sm:w-[200px] md:w-[220px]">
                  <ProductCard product={product} />
               </div>
             ))}
          </div>
        </div>
      ))}

      {/* Default Rows if no collections */}
      {collections.length === 0 && (
        <div className="flex flex-col gap-24">
          <div>
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl md:text-2xl font-black text-noon-black uppercase tracking-tight flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-noon-yellow rounded-full"></span>
                  Recommended for you
               </h2>
               <button className="text-sm font-bold bg-white border border-gray-300 px-4 py-1.5 rounded hover:bg-gray-50 flex items-center gap-2 transition uppercase">View All</button>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {electronics.map((product) => (
                <div key={product.id} className="w-[160px] sm:w-[200px] md:w-[220px]">
                   <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-noon-yellow"></div>
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl md:text-2xl font-black text-noon-black uppercase tracking-tight flex items-center gap-3">
                  Trending Best Sellers
               </h2>
               <span className="text-sm font-black text-noon-yellow uppercase">Must buy</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {bestSellers.map((product) => (
                <div key={product.id} className="w-[160px] sm:w-[200px] md:w-[220px]">
                   <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 bg-white p-6 md:p-8 rounded-xl my-4 text-center border border-gray-100 shadow-sm">
        <div className="flex flex-col items-center gap-3 p-4 hover:bg-gray-50 rounded-lg transition group">
          <div className="w-14 h-14 bg-noon-yellow/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><span className="text-2xl">⚡</span></div>
          <h4 className="font-black text-sm md:text-base uppercase tracking-tight text-noon-black">Fast Delivery</h4>
          <p className="text-[10px] md:text-xs text-gray-500 max-w-[180px] font-medium leading-tight">Get your items faster with noon express delivery</p>
        </div>
        <div className="flex flex-col items-center gap-3 p-4 hover:bg-gray-50 rounded-lg transition group">
          <div className="w-14 h-14 bg-noon-yellow/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><span className="text-2xl">🛡️</span></div>
          <h4 className="font-black text-sm md:text-base uppercase tracking-tight text-noon-black">Secure Payments</h4>
          <p className="text-[10px] md:text-xs text-gray-500 max-w-[180px] font-medium leading-tight">100% secure payment with advanced encryption</p>
        </div>
        <div className="flex flex-col items-center gap-3 p-4 hover:bg-gray-50 rounded-lg transition group col-span-2 md:col-span-1">
          <div className="w-14 h-14 bg-noon-yellow/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><span className="text-2xl">🔄</span></div>
          <h4 className="font-black text-sm md:text-base uppercase tracking-tight text-noon-black">Easy Returns</h4>
          <p className="text-[10px] md:text-xs text-gray-500 max-w-[180px] font-medium leading-tight">Return items within 15 days for a hassle-free refund</p>
        </div>
      </div>
    </div>
  );
}


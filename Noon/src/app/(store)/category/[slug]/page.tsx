import { PrismaClient } from "@prisma/client";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

const prisma = new PrismaClient();

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    return <div className="p-20 text-center font-bold text-2xl">Category Not Found</div>;
  }

  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="pt-6 pb-20 page-enter px-4 md:px-0">
      
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
         <Link href="/" className="hover:underline">Home</Link>
         <span>/</span>
         <span className="text-gray-800 font-medium">{category.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
         
         {/* Sidebar filters (Static Mock) */}
         <aside className="w-full md:w-64 shrink-0 hidden md:block">
            <div className="bg-white border border-gray-100 rounded-lg p-4 sticky top-28 shadow-sm">
               <h3 className="font-bold border-b pb-2 mb-4 text-sm uppercase">Filters</h3>
               
               <div className="mb-6">
                  <h4 className="font-bold text-xs text-gray-600 mb-3 uppercase tracking-wide">Brand</h4>
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                     {['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'MAC', 'Pampers'].map(brand => (
                        <label key={brand} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                           <input type="checkbox" className="rounded text-noon-blue focus:ring-noon-blue border-gray-300" />
                           {brand}
                        </label>
                     ))}
                  </div>
               </div>

               <div>
                  <h4 className="font-bold text-xs text-gray-600 mb-3 uppercase tracking-wide">Customer Rating</h4>
                  <div className="flex flex-col gap-2">
                     {[4,3,2,1].map(stars => (
                        <label key={stars} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                           <input type="radio" name="rating" className="text-noon-blue focus:ring-noon-blue border-gray-300" />
                           <div className="flex text-yellow-400 text-xs">{"★".repeat(stars)}{"☆".repeat(5-stars)}</div>
                           <span>& Up</span>
                        </label>
                     ))}
                  </div>
               </div>
            </div>
         </aside>

         {/* Main Listing */}
         <main className="flex-1">
            <div className="bg-white border border-gray-100 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 shadow-sm">
               <h1 className="text-xl md:text-2xl font-black">{category.name} <span className="text-gray-400 text-sm font-medium">({products.length} items)</span></h1>
               
               <div className="flex gap-2 w-full md:w-auto">
                 <button className="md:hidden flex items-center justify-center gap-2 border rounded p-2 text-sm font-bold flex-1 bg-gray-50">
                    <SlidersHorizontal size={16} /> Filter
                 </button>
                 <select className="border rounded p-2 text-sm font-bold outline-none flex-1 md:w-48 bg-gray-50 focus:border-noon-blue">
                   <option>Sort by: Recommended</option>
                   <option>Sort by: Price (Low to High)</option>
                   <option>Sort by: Price (High to Low)</option>
                   <option>Sort by: Rating</option>
                 </select>
               </div>
            </div>

            {products.length === 0 ? (
               <div className="text-center py-20 text-gray-500 font-bold bg-white rounded-lg border border-gray-100 shadow-sm">
                  No products found in this category.
               </div>
            ) : (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
               </div>
            )}
         </main>
      </div>
    </div>
  );
}

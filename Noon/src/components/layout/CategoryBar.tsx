import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoryBar() {
  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      take: 10,
      orderBy: { name: "asc" }
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  const mockCategories = [
    { id: '1', name: 'Electronics', slug: 'electronics' },
    { id: '2', name: 'Fashion', slug: 'fashion' },
    { id: '3', name: 'Beauty', slug: 'beauty' },
    { id: '4', name: 'Home', slug: 'home-kitchen' },
    { id: '5', name: 'Grocery', slug: 'grocery' },
  ];

  const displayCategories = categories.length > 0 ? categories : mockCategories;

  return (
    <div className="w-full bg-white border-b shadow-sm hidden md:block">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-center h-11 overflow-x-auto no-scrollbar relative">
        <div className="absolute left-4">
           <Link href="/categories" className="text-noon-blue flex items-center gap-1 hover:text-noon-blue/80 transition cursor-pointer">
              <span className="font-black uppercase tracking-tighter text-[13px]">All Categories</span> <span className="text-[10px]">▼</span>
           </Link>
        </div>
        
        <div className="flex items-center gap-8 text-[12px] font-bold text-noon-black whitespace-nowrap uppercase tracking-widest">
          
          {displayCategories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.slug}`} 
              className={`hover:opacity-70 transition cursor-pointer uppercase tracking-tight`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="absolute right-4">
          <Link href="/sell" className="text-noon-red hover:opacity-70 transition cursor-pointer uppercase font-black tracking-widest text-[11px]">
             Sell on Noon
          </Link>
        </div>
      </div>
    </div>
  );
}

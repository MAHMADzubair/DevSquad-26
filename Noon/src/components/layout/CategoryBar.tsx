import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoryBar() {
  const categories = await prisma.category.findMany({
     where: { parentId: null },
     take: 10
  });

  return (
    <div className="w-full bg-white border-b shadow-sm hidden md:block">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between h-10 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6 text-[13px] font-bold text-noon-black whitespace-nowrap">
          <Link href="/categories" className="text-noon-blue flex items-center gap-1 hover:text-noon-blue/80 transition cursor-pointer">
            <span className="font-black uppercase tracking-tighter">All Categories</span> <span className="text-[10px]">▼</span>
          </Link>
          
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.slug}`} 
              className={`hover:opacity-70 transition cursor-pointer uppercase tracking-tight`}
            >
              {cat.name}
            </Link>
          ))}

          <Link href="/sell" className="text-noon-red ml-auto hover:opacity-70 transition cursor-pointer uppercase font-black tracking-tight">
             Sell on Noon
          </Link>
        </div>
      </div>
    </div>
  );
}

import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import { Star, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import ImageGallery from "./ImageGallery";

const prisma = new PrismaClient();

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product) return <div className="p-20 text-center font-bold text-2xl">Product Not Found</div>;

  const images = JSON.parse(product.images || "[]");
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="pt-6 page-enter pb-20">
      
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
         <Link href="/" className="hover:underline">Home</Link>
         <span>/</span>
         <Link href={`/category/${product.category.slug}`} className="hover:underline">{product.category.name}</Link>
         <span>/</span>
         <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-8 lg:gap-12">
        
        {/* Left: Interactive Image Gallery */}
        <ImageGallery images={images} productName={product.name} badge={product.badge} />

        {/* Middle/Right: Details */}
        <div className="w-full md:w-2/3 flex flex-col lg:flex-row gap-8">
           
           <div className="flex-1 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-8">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 tracking-wider">
                 {product.brand && <span className="uppercase text-noon-blue bg-blue-50 px-2 py-0.5 rounded">{product.brand}</span>}
              </div>
              
              <h1 className="text-xl md:text-2xl font-medium text-gray-800 leading-snug">{product.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm mt-1">
                 <div className="flex items-center gap-1 font-bold text-gray-500">
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                    <span>{product.rating.toFixed(1)}</span>
                    <Link href="#" className="font-normal text-noon-blue hover:underline">({product.reviewCount} reviews)</Link>
                 </div>
                 {product.isNoonExpress && (
                   <span className="badge-express flex items-center gap-1 px-2 py-0.5 text-xs">noon <span className="italic font-black text-black">express</span></span>
                 )}
              </div>

              <div className="flex flex-col mt-2">
                 {product.originalPrice && discount > 0 ? (
                   <>
                     <span className="text-gray-400 line-through text-sm font-medium">Was: AED {product.originalPrice}</span>
                     <div className="flex items-center gap-3 mt-1">
                       <span className="text-3xl font-black text-noon-black">AED {product.price.toLocaleString()}</span>
                       <span className="bg-noon-green/10 text-noon-green font-bold px-2 py-1 rounded text-sm shrink-0">Saving: AED {product.originalPrice - product.price} ({discount}%)</span>
                     </div>
                   </>
                 ) : (
                    <span className="text-3xl font-black text-noon-black mt-1">AED {product.price.toLocaleString()}</span>
                 )}
                 <span className="text-[10px] text-gray-500 mt-1 font-medium">Prices include VAT</span>
              </div>

              <div className="w-full h-px bg-gray-100 my-2"></div>

              <div>
                <h3 className="font-bold text-sm mb-2 text-gray-700">Overview</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">{product.description}</p>
              </div>
           </div>

           {/* Purchase box */}
           <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4">
              <div className="flex gap-3 text-[13px] font-bold items-center border border-gray-100 p-3 rounded-md bg-gray-50 shadow-sm">
                 <Truck size={24} className="text-noon-blue" />
                 <div>
                    <span className="block text-noon-blue uppercase text-[10px] tracking-wide">Ready to ship</span>
                    <span className="text-gray-700">Order now for fast delivery.</span>
                 </div>
              </div>

              {product.stock > 0 ? (
                 <div className="flex flex-col gap-3">
                   <AddToCartButton product={product} />
                   <p className="text-center text-xs text-gray-500 font-medium">Sold by <span className="font-bold text-noon-black">noon</span></p>
                 </div>
              ) : (
                 <div className="bg-red-50 text-red-600 border border-red-200 rounded p-4 text-center font-bold">
                    Currently Out of Stock
                 </div>
              )}

              <div className="flex flex-col gap-3 mt-4 text-[13px] font-medium text-gray-600 border-t pt-4">
                 <div className="flex items-center gap-3"><ShieldCheck size={20} className="text-gray-400" /> 1 year warranty</div>
                 <div className="flex items-center gap-3"><RefreshCcw size={20} className="text-gray-400" /> Easy 15-day return policy</div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

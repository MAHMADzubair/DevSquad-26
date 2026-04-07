"use client";
import Image from "next/image";
import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
    const router = useRouter();
    const [filters, setFilters] = useState({
        make: "",
        model: "",
        year: "",
        price: ""
    });

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (filters.make) params.append("make", filters.make);
        if (filters.model) params.append("model", filters.model);
        if (filters.year) params.append("year", filters.year);
        if (filters.price) params.append("maxPrice", filters.price);
        router.push(`/auction?${params.toString()}`);
    };

    return (
        <div className="relative w-full min-h-[500px] lg:h-[685px] overflow-hidden flex flex-col">
            <Image
                src="/hero-bg.png"
                alt="Luxury SUV in Snowy Mountains"
                fill
                priority
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[118px] h-full flex flex-col justify-center pt-[100px] lg:pt-[50px] pb-20 lg:pb-0">
                <div className="bg-[#BBD0F6] w-fit px-4 py-2.5 rounded-[5px] mb-6 shadow-sm border border-white/20">
                    <span className="text-[#2E3D83] font-bold text-sm lg:text-base tracking-wide uppercase">
                        Welcome to Auction
                    </span>
                </div>

                <h1 className="font-[family-name:var(--font-sans)] font-bold text-[36px] md:text-[54px] lg:text-[74px] leading-tight text-white max-w-[600px] mb-4 drop-shadow-lg">
                    Find Your Dream Car
                </h1>

                <p className="text-[#E0E0E0] text-sm md:text-base lg:text-lg max-w-[447px] mb-8 lg:mb-12 font-medium leading-relaxed">
                    Browse our exclusive collection of luxury vehicles. Discover performance, comfort, and style in every auction.
                </p>

                <div className="lg:absolute bottom-[40px] left-0 right-0 lg:left-[118px] lg:right-[118px] px-5 lg:px-0">
                    <div className="bg-white rounded-[5px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] p-2 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:h-20 border border-white/10 backdrop-blur-sm">
                        
                        <div className="flex-1 px-4 flex flex-col justify-center border-r border-gray-100 last:border-0 h-full">
                            <span className="text-[12px] text-[#9A9A9A] font-bold uppercase tracking-wider mb-1">Make</span>
                            <select 
                                value={filters.make}
                                onChange={(e) => setFilters(prev => ({ ...prev, make: e.target.value }))}
                                className="text-black font-bold focus:outline-none bg-transparent cursor-pointer appearance-none"
                            >
                                <option value="">All Makes</option>
                                <option value="Audi">Audi</option>
                                <option value="BMW">BMW</option>
                                <option value="Porsche">Porsche</option>
                                <option value="Mazda">Mazda</option>
                            </select>
                        </div>

                        <div className="flex-1 px-4 flex flex-col justify-center border-r border-gray-100 last:border-0 h-full">
                            <span className="text-[12px] text-[#9A9A9A] font-bold uppercase tracking-wider mb-1">Year</span>
                            <select 
                                value={filters.year}
                                onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                                className="text-black font-bold focus:outline-none bg-transparent cursor-pointer appearance-none"
                            >
                                <option value="">All Years</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                            </select>
                        </div>

                        <div className="flex-1 px-4 flex flex-col justify-center border-r border-gray-100 last:border-0 h-full">
                            <span className="text-[12px] text-[#9A9A9A] font-bold uppercase tracking-wider mb-1">Price Range</span>
                            <select 
                                value={filters.price}
                                onChange={(e) => setFilters(prev => ({ ...prev, price: e.target.value }))}
                                className="text-black font-bold focus:outline-none bg-transparent cursor-pointer appearance-none"
                            >
                                <option value="">Any Price</option>
                                <option value="50000">Up to $50,000</option>
                                <option value="100000">Up to $100,000</option>
                                <option value="200000">Up to $200,000</option>
                            </select>
                        </div>

                        <button 
                            onClick={handleSearch}
                            className="bg-[#2E3D83] text-white h-full px-12 rounded-[3px] flex items-center justify-center gap-3 transition-all hover:bg-[#1e2a5a] max-md:py-4 active:scale-95 shadow-[0_4px_10px_rgba(46,61,131,0.3)]"
                        >
                            <Search size={20} className="stroke-[3px]" />
                            <span className="text-lg font-bold uppercase tracking-wide">Search</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

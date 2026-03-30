"use client";

import Link from "next/link";
import { User, ShoppingCart, Heart, Search, Menu } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore, useWishlistStore } from "@/store/cartStore";

export default function Header() {
  const { data: session } = useSession();
  const cartItemCount = useCartStore((state) => state.getTotalItems());
  const wishlistCount = useWishlistStore((state) => state.getCount());

  return (
    <header className="w-full">
      {/* Top Banner (Yellow) */}
      <div className="bg-noon-yellow w-full h-[60px] flex items-center px-4 md:px-8 gap-4 justify-between">
        
        {/* Logo area */}
        <div className="flex items-center gap-4 cursor-pointer">
          <Menu className="md:hidden w-6 h-6 text-noon-black" />
          <Link href="/">
            <h1 className="text-3xl font-black italic tracking-tighter text-noon-black">noon</h1>
          </Link>
          <div className="hidden md:flex flex-col ml-4 border-l border-noon-black/20 pl-4 h-10 justify-center">
             <span className="text-[10px] text-noon-black/60 font-semibold uppercase">Deliver to</span>
             <span className="text-sm font-bold flex items-center gap-1">Dubai <span className="text-[10px]">▼</span></span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-3xl hidden md:flex relative h-10">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="w-full h-full rounded-md px-4 pr-10 outline-none text-sm focus:ring-2 focus:ring-noon-black/20 font-medium"
          />
          <button className="absolute right-0 top-0 h-full px-3 text-noon-black/60 hover:text-noon-black">
             <Search size={20} />
          </button>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-4 lg:gap-6 font-semibold text-sm">
          <div className="hidden lg:flex items-center gap-1 cursor-pointer hover:opacity-80">
            العربية
          </div>

          {!session ? (
            <Link href="/login" className="flex items-center gap-2 cursor-pointer border-l border-noon-black/20 pl-4 lg:pl-6 h-10">
              <span className="hidden md:inline">Log In</span>
              <User size={20} />
            </Link>
          ) : (
            <div className="relative group border-l border-noon-black/20 pl-4 lg:pl-6 h-10 flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                <span className="hidden md:inline truncate max-w-[80px]">Hi, {session.user?.name?.split(" ")[0]}</span>
                <User size={20} />
              </Link>
              <div className="absolute top-10 right-0 w-48 bg-white shadow-xl border rounded-md p-2 hidden group-hover:block z-50">
                <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 rounded text-noon-black/80">My Profile</Link>
                <Link href="/dashboard/orders" className="block px-4 py-2 hover:bg-gray-100 rounded text-noon-black/80">Orders</Link>
                {((session?.user as any)?.role === "ADMIN") && (
                   <Link href="/admin" className="block px-4 py-2 hover:bg-gray-100 rounded text-noon-black/80 font-bold">Admin Panel</Link>
                )}
                <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-noon-red">
                  Sign Out
                </button>
              </div>
            </div>
          )}

          <Link href="/dashboard/wishlist" className="flex items-center gap-2 cursor-pointer border-l border-noon-black/20 pl-4 lg:pl-6 h-10 relative">
            <span className="hidden md:inline">Wishlist</span>
            <div className="relative">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-noon-red text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {wishlistCount}
                </span>
              )}
            </div>
          </Link>

          <Link href="/cart" className="flex items-center gap-2 cursor-pointer border-l border-noon-black/20 pl-4 lg:pl-6 h-10 relative">
            <span className="hidden md:inline">Cart</span>
            <div className="relative">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-noon-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartItemCount}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar below main header */}
      <div className="md:hidden bg-noon-yellow w-full px-4 pb-3 flex relative shadow-sm">
        <input
            type="text"
            placeholder="What are you looking for?"
            className="w-full h-10 rounded-md px-4 pr-10 outline-none text-sm font-medium"
          />
          <button className="absolute right-4 top-0 h-10 px-3 text-noon-black/60">
             <Search size={20} />
          </button>
      </div>
    </header>
  );
}

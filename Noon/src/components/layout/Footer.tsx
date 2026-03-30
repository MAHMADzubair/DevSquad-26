import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Apple, Play } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t mt-12 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 text-sm">
        <div>
          <h3 className="font-bold text-noon-black mb-4">ELECTRONICS</h3>
          <ul className="flex flex-col gap-2 text-noon-black/60">
            <li><Link href="#">Mobiles</Link></li>
            <li><Link href="#">Tablets</Link></li>
            <li><Link href="#">Laptops</Link></li>
            <li><Link href="#">Home Appliances</Link></li>
            <li><Link href="#">Camera, Photo & Video</Link></li>
            <li><Link href="#">Televisions</Link></li>
            <li><Link href="#">Headphones</Link></li>
            <li><Link href="#">Video Games</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-noon-black mb-4">FASHION</h3>
          <ul className="flex flex-col gap-2 text-noon-black/60">
            <li><Link href="#">Women's Fashion</Link></li>
            <li><Link href="#">Men's Fashion</Link></li>
            <li><Link href="#">Girls' Fashion</Link></li>
            <li><Link href="#">Boys' Fashion</Link></li>
            <li><Link href="#">Watches</Link></li>
            <li><Link href="#">Jewellery</Link></li>
            <li><Link href="#">Women's Handbags</Link></li>
            <li><Link href="#">Men's Eyewear</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-noon-black mb-4">HOME AND KITCHEN</h3>
          <ul className="flex flex-col gap-2 text-noon-black/60">
            <li><Link href="#">Bath</Link></li>
            <li><Link href="#">Home Decor</Link></li>
            <li><Link href="#">Kitchen & Dining</Link></li>
            <li><Link href="#">Tools & Home Improvement</Link></li>
            <li><Link href="#">Audio & Video</Link></li>
            <li><Link href="#">Furniture</Link></li>
            <li><Link href="#">Patio, Lawn & Garden</Link></li>
            <li><Link href="#">Pet Supplies</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-noon-black mb-4">BEAUTY</h3>
          <ul className="flex flex-col gap-2 text-noon-black/60">
            <li><Link href="#">Fragrance</Link></li>
            <li><Link href="#">Make-Up</Link></li>
            <li><Link href="#">Haircare</Link></li>
            <li><Link href="#">Skincare</Link></li>
            <li><Link href="#">Bath & Body</Link></li>
            <li><Link href="#">Electronic Beauty Tools</Link></li>
            <li><Link href="#">Men's Grooming</Link></li>
            <li><Link href="#">Health Care Essentials</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-noon-black mb-4">BABY & TOYS</h3>
          <ul className="flex flex-col gap-2 text-noon-black/60">
            <li><Link href="#">Diapering</Link></li>
            <li><Link href="#">Baby Transport</Link></li>
            <li><Link href="#">Nursing & Feeding</Link></li>
            <li><Link href="#">Baby & Kids Fashion</Link></li>
            <li><Link href="#">Baby & Toddler Toys</Link></li>
            <li><Link href="#">Tricycles & Scooters</Link></li>
            <li><Link href="#">Board Games & Cards</Link></li>
            <li><Link href="#">Outdoor Play</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-noon-black mb-4">TOP BRANDS</h3>
          <ul className="flex flex-col gap-2 text-noon-black/60">
            <li><Link href="#">Pampers</Link></li>
            <li><Link href="#">Apple</Link></li>
            <li><Link href="#">Nike</Link></li>
            <li><Link href="#">Samsung</Link></li>
            <li><Link href="#">Tefal</Link></li>
            <li><Link href="#">L'Oreal Paris</Link></li>
            <li><Link href="#">Skechers</Link></li>
            <li><Link href="#">Silit</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 pt-8 border-t flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-6">
            <h4 className="font-bold text-noon-black/80">SHOP ON THE GO</h4>
            <div className="flex gap-2 text-white">
              <button className="bg-black px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition">
                <Apple size={20} />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px]">Download on the</span>
                  <span className="font-bold">App Store</span>
                </div>
              </button>
              <button className="bg-black px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition">
                <Play size={20} />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px]">GET IT ON</span>
                  <span className="font-bold">Google Play</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-6">
            <h4 className="font-bold text-noon-black/80">CONNECT WITH US</h4>
            <div className="flex gap-4 cursor-pointer text-noon-black/40 bg-zinc-100 p-2 rounded-full">
              <Facebook size={24} className="hover:text-blue-600 transition" />
              <Twitter size={24} className="hover:text-sky-500 transition" />
              <Instagram size={24} className="hover:text-rose-500 transition" />
              <Linkedin size={24} className="hover:text-blue-700 transition" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-noon-black/40 mt-12 bg-zinc-100 py-4 font-medium">
        © 2026 noon. All Rights Reserved
      </div>
    </footer>
  );
}

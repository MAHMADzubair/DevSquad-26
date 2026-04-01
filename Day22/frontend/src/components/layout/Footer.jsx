import React from 'react';
import { Globe, Share2, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 w-full py-20 px-6 lg:px-12 mt-auto">
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-[#282828]">
        <div>
          <h4 className="text-[11px] font-bold tracking-[2.5px] uppercase mb-8 opacity-40">Collections</h4>
          <div className="flex flex-col gap-3 text-[11px] font-bold">
            {['Black teas', 'Green teas', 'White teas', 'Herbal teas', 'Matcha', 'Chai', 'Oolong', 'Rooibos', 'Teaware'].map((link) => (
              <a key={link} href="#" className="hover:text-gray-500 transition-colors">{link}</a>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-[11px] font-bold tracking-[2.5px] uppercase mb-8 opacity-40">Learn</h4>
          <div className="flex flex-col gap-3 text-[11px] font-bold">
            <a href="#" className="hover:text-gray-500 transition-colors">About us</a>
            <a href="#" className="hover:text-gray-500 transition-colors">About our teas</a>
            <a href="#" className="hover:text-gray-500 transition-colors">Tea academy</a>
          </div>
        </div>
        
        <div>
          <h4 className="text-[11px] font-bold tracking-[2.5px] uppercase mb-8 opacity-40">Customer Service</h4>
          <div className="flex flex-col gap-3 text-[11px] font-bold">
            <a href="#" className="hover:text-gray-500 transition-colors">Ordering and payment</a>
            <a href="#" className="hover:text-gray-500 transition-colors">Delivery</a>
            <a href="#" className="hover:text-gray-500 transition-colors">Privacy and policy</a>
            <a href="#" className="hover:text-gray-500 transition-colors">Terms & Conditions</a>
          </div>
        </div>
        
        <div>
          <h4 className="text-[11px] font-bold tracking-[2.5px] uppercase mb-8 opacity-40">Contact Us</h4>
          <div className="flex flex-col gap-6 text-[11px] font-bold">
             <div className="flex gap-4">
               <Globe size={14} className="opacity-40 shrink-0 mt-0.5" />
               <span className="leading-relaxed">3 Falahi, Falahi St, Pasdaran Ave,<br/>Shiraz, Fars Provience<br/>Iran</span>
             </div>
             <div className="flex gap-4 items-center">
               <Share2 size={14} className="opacity-40 shrink-0" />
               <span>Email: amoo-pur@gmail.com</span>
             </div>
             <div className="flex gap-4 items-center">
               <Zap size={14} className="opacity-40 shrink-0" />
               <span>Tel: +98 9173038406</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

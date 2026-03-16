import React, { useState, useEffect } from 'react';
import { Globe, Leaf, ShoppingBag, Minus, Plus, Heart, Share2, Award, Thermometer, Clock, Droplets, Utensils, Zap, ShieldAlert, Package, Container } from 'lucide-react';
import toast from 'react-hot-toast';
import NotificationModal from '../common/NotificationModal';
import { motion } from 'framer-motion';
import { getProducts } from '../../services/productService';
import ProductCard from '../collection/ProductCard';

const VariantIcon = ({ type, label }) => {
  if (type === 'sampler') return (
    <div className="relative flex flex-col items-center">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 15L20 10L30 15V30L20 35L10 30V15Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 15L20 20L30 15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M20 20V35" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
      <span className="text-[9px] mt-1 uppercase font-bold text-gray-400">Sample</span>
    </div>
  );
  if (type === 'tin') return (
    <div className="relative flex flex-col items-center">
      <div className="w-10 h-11 border-2 border-current rounded-sm relative flex flex-col items-center pt-1">
        <div className="w-8 h-1 bg-current mb-0.5 rounded-full opacity-20" />
        <span className="text-[10px] font-bold z-10">{label}</span>
      </div>
      <span className="text-[9px] mt-1 uppercase font-bold text-gray-400">tin</span>
    </div>
  );
  return (
    <div className="relative flex flex-col items-center">
      <div className="w-10 h-12 border-2 border-current rounded-t-lg rounded-b-sm relative flex items-center justify-center pt-1">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1.5 bg-white border-t-2 border-x-2 border-current rounded-full" />
        <span className="text-[10px] font-bold">{label}</span>
      </div>
      <span className="text-[9px] mt-1 uppercase font-bold text-gray-400">bag</span>
    </div>
  );
};

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(product?.variants?.[0]?._id || null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const data = await getProducts({ category: product.category, limit: 3 });
        if (data.success) {
          setRelatedProducts(data.products.filter(p => p._id !== product._id));
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (product) fetchRelated();
  }, [product]);

  if (!product) return null;

  const selectedVariant = product.variants?.find(v => v._id === selectedVariantId) || product.variants?.[0] || null;
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      const { addToCart } = await import('../../services/cartService');
      await addToCart(product._id, selectedVariantId, quantity);
      toast.success('Added to bag!');
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      if (message.includes('Not authorized') || message.includes('token')) {
        setIsAuthModalOpen(true);
      } else {
        toast.error(message || 'Error adding to cart');
      }
    }
    setAdding(false);
  };

  return (
    <div className="w-full bg-white">
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-8">
        <div className="text-[10px] font-bold tracking-[2.5px] text-gray-400 uppercase font-sans">
          HOME / COLLECTIONS / {product.category} / {product.name}
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-32">
        {/* Left: Image */}
        <div className="relative group">
          <div className="aspect-square w-full bg-[#F4F4F4] overflow-hidden">
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={activeImage}
              src={product.images?.[activeImage] || "/placeholder-tea.png"} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700"
            />
          </div>
          {product.images?.length > 1 && (
             <div className="flex gap-4 mt-6 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 shrink-0 border-2 transition-all ${activeImage === idx ? 'border-black' : 'border-transparent opacity-60'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
             </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col pt-0">
          <h1 className="text-4xl lg:text-5xl font-medium leading-tight text-[#282828] mb-4 heading-font">
            {product.name}
          </h1>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed max-w-lg">
            {product.description}
          </p>

          <div className="flex items-center gap-8 mb-8 text-[11px] font-bold uppercase tracking-widest text-gray-500">
             <div className="flex items-center gap-2">
               <Globe size={16} strokeWidth={1.5} />
               Origin: {product.origin || 'India'}
             </div>
             <div className="flex items-center gap-2">
               <Award size={16} strokeWidth={1.5} />
               Organic
             </div>
             <div className="flex items-center gap-2">
               <Leaf size={16} strokeWidth={1.5} />
               Vegan
             </div>
          </div>

          <div className="text-4xl font-medium text-[#282828] mb-10">
            €{currentPrice.toFixed(2)}
          </div>

          <div className="mb-10">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6">Variants</h3>
            <div className="flex items-end gap-x-8 gap-y-10 flex-wrap min-h-[80px]">
              {product.variants?.map((v) => (
                <button
                  key={v._id}
                  onClick={() => setSelectedVariantId(v._id)}
                  className={`flex flex-col items-center group transition-all ${selectedVariantId === v._id ? 'text-[#282828]' : 'text-gray-300 hover:text-gray-400'}`}
                >
                  <VariantIcon type={v.type} label={v.label} />
                  <span className={`text-[10px] mt-2 font-bold transition-opacity ${selectedVariantId === v._id ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'}`}>
                    {v.size} {v.type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-10">
             <div className="flex items-center text-[#282828]">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:opacity-50 transition-opacity"><Minus size={18} /></button>
                <span className="w-10 text-center text-xl font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:opacity-50 transition-opacity"><Plus size={18} /></button>
             </div>
             <button 
               onClick={handleAddToCart}
               disabled={adding}
               className="flex-1 max-w-[320px] bg-[#282828] text-white h-14 uppercase text-[11px] font-bold tracking-[3px] flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-[0.98]"
             >
               <ShoppingBag size={18} />
               {added ? 'Added to bag' : adding ? 'Adding...' : 'Add to bag'}
             </button>
          </div>

          <div className="mt-12 flex items-center gap-10 text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#11BD11]" />
                In Stock
             </div>
             <div className="flex items-center gap-2">
                <Globe size={14} className="opacity-40" />
                Free Global Shipping
             </div>
          </div>
        </div>
      </div>

      {/* Details Subsection */}
      <div className="w-full bg-[#F4F4F4] py-20 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Steeping instructions */}
          <div>
            <h2 className="text-2xl font-medium mb-12 heading-font text-[#282828]">Steeping instructions</h2>
            <div className="space-y-8">
               <div className="flex items-center gap-5">
                  <div className="w-8 h-8 flex items-center justify-center text-gray-400"><Container size={20} strokeWidth={1.5} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Serving size</span>
                    <span className="text-xs font-bold uppercase text-[#282828]">{product.servingSize || '2 tsp per cup, 6 tsp per pot'}</span>
                  </div>
               </div>
               <div className="flex items-center gap-5">
                  <div className="w-8 h-8 flex items-center justify-center text-gray-400"><Thermometer size={20} strokeWidth={1.5} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Water temperature</span>
                    <span className="text-xs font-bold uppercase text-[#282828]">{product.waterTemp || '100°C'}</span>
                  </div>
               </div>
               <div className="flex items-center gap-5">
                  <div className="w-8 h-8 flex items-center justify-center text-gray-400"><Clock size={20} strokeWidth={1.5} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Steeping time</span>
                    <span className="text-xs font-bold uppercase text-[#282828]">{product.steepingTime || '3 - 5 minutes'}</span>
                  </div>
               </div>
               <div className="flex items-center gap-5">
                  <div className="w-8 h-8 flex items-center justify-center"><div className="w-5 h-5 rounded-full bg-[#821415]" /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Color after 3 minutes</span>
                  </div>
               </div>
            </div>
          </div>

          {/* About this tea */}
          <div>
            <h2 className="text-2xl font-medium mb-12 heading-font text-[#282828]">About this tea</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12 border-b border-gray-200 pb-12">
               <div className="flex flex-col gap-2">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Flavor</span>
                 <span className="text-xs font-bold text-[#282828] uppercase">{product.flavor || 'Spicy'}</span>
               </div>
               <div className="flex flex-col gap-2">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Qualities</span>
                 <span className="text-xs font-bold text-[#282828] uppercase max-w-[80px] leading-tight">{product.qualities?.join(' ') || 'Smoothing'}</span>
               </div>
               <div className="flex flex-col gap-2">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Caffeine</span>
                 <span className="text-xs font-bold text-[#282828] uppercase">{product.caffeine || 'Medium'}</span>
               </div>
               <div className="flex flex-col gap-2">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Allergens</span>
                 <span className="text-xs font-bold text-[#282828] uppercase">{product.allergens?.join(', ') || 'Nuts-free'}</span>
               </div>
            </div>

            <div>
              <h3 className="text-2xl font-medium mb-6 heading-font text-[#282828]">Ingredient</h3>
              <p className="text-xs leading-relaxed text-gray-600 max-w-lg font-medium">
                {product.ingredients || 'Black Ceylon tea, Green tea, Ginger root, Cloves, Black pepper, Cinnamon sticks, Cardamom, Cinnamon pieces.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 border-t border-gray-50">
           <h2 className="text-3xl font-medium mb-16 text-center heading-font text-[#282828]">You may also like</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
              {relatedProducts.map(p => {
                const nameParts = p.name.split(' ');
                const title1 = nameParts.slice(0, 2).join(' ');
                const title2 = nameParts.slice(2).join(' ');
                return (
                  <div key={p._id} className="flex flex-col items-center group cursor-pointer">
                     <div className="w-full aspect-square bg-[#F4F4F4] mb-8 overflow-hidden">
                       <img src={p.images?.[0]} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500 mix-blend-multiply" />
                     </div>
                     <h3 className="text-[13px] font-medium text-center mb-3 leading-snug text-[#282828]">
                        {title1}<br/>{title2}
                     </h3>
                     <div className="flex items-center gap-1.5 text-[11px] font-bold">
                        <span className="text-[13px]">€{p.price.toFixed(2)}</span>
                        <span className="text-gray-400">/ {p.variants?.[0]?.size || '50 g'}</span>
                     </div>
                  </div>
                );
              })}
           </div>
        </div>
      )}

      {/* App Footer space */}
      <NotificationModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        message="You need to create account first before place order"
      />
    </div>
  );
};

export default ProductDetails;

import React from 'react';
import { CupSoda, Droplet, Clock } from 'lucide-react'; // Using similar icons for now

const ProductInfo = ({ product }) => {
  if (!product) return null;

  return (
    <section className="bg-[var(--color-brand-surface)] w-full py-20 px-8 lg:px-16 mb-20 flex justify-center text-[var(--color-brand-primary)]">
      <div className="max-w-[1400px] w-full flex flex-col md:flex-row gap-16 lg:gap-24">
        
        {/* Left Column: Steeping Instructions */}
        <div className="md:w-[45%] lg:w-[40%] flex flex-col pt-8">
          <h2 className="text-3xl font-medium tracking-wide mb-10 text-gray-800">
            Steeping instructions
          </h2>
          
          <div className="flex flex-col space-y-6 text-[11px] font-medium tracking-[0.5px]">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-300">
              <CupSoda size={20} strokeWidth={1.5} />
              <div className="flex items-center gap-2">
                <span className="font-semibold uppercase">SERVING SIZE:</span>
                <span className="text-gray-600">{product.servingSize || "2 tsp per cup"}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pb-4 border-b border-gray-300">
              <Droplet size={20} strokeWidth={1.5} />
              <div className="flex items-center gap-2">
                <span className="font-semibold uppercase">WATER TEMPERATURE:</span>
                <span className="text-gray-600">{product.waterTemp || "100°C"}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pb-4 border-b border-gray-300">
              <Clock size={20} strokeWidth={1.5} />
              <div className="flex items-center gap-2">
                <span className="font-semibold uppercase">STEEPING TIME:</span>
                <span className="text-gray-600">{product.steepingTime || "3 - 5 minutes"}</span>
              </div>
            </div>
            
            {product.colorAfter && (
              <div className="flex items-center gap-4 pb-4">
                <div className="w-5 h-5 rounded-full bg-[#B45A5A] ml-0.5" />
                <div className="flex items-center gap-2 ml-[0.2rem]">
                  <span className="font-semibold uppercase">COLOR AFTER 3 MINUTES</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: About and Ingredients */}
        <div className="md:w-[55%] lg:w-[50%] flex flex-col pt-8">
          {/* About This Tea */}
          <div className="mb-14">
            <h2 className="text-3xl font-medium tracking-wide mb-10 text-gray-800">
              About this tea
            </h2>
            <div className="flex flex-wrap text-[11px] uppercase tracking-[0.5px]">
              {product.flavor && (
                <div className="flex flex-col pr-8 border-r border-gray-300 mr-8 mb-4">
                  <span className="font-semibold mb-2">FLAVOR</span>
                  <span className="text-gray-600 font-medium capitalize">{product.flavor}</span>
                </div>
              )}
              {product.qualities?.length > 0 && (
                <div className="flex flex-col pr-8 border-r border-gray-300 mr-8 mb-4">
                  <span className="font-semibold mb-2">QUALITIES</span>
                  <span className="text-gray-600 font-medium capitalize">{product.qualities.join(', ')}</span>
                </div>
              )}
              {product.caffeine && (
                <div className="flex flex-col pr-8 border-r border-gray-300 mr-8 mb-4">
                  <span className="font-semibold mb-2">CAFFEINE</span>
                  <span className="text-gray-600 font-medium capitalize">{product.caffeine}</span>
                </div>
              )}
              {product.allergens?.length > 0 && (
                <div className="flex flex-col mb-4">
                  <span className="font-semibold mb-2">ALLERGENS</span>
                  <span className="text-gray-600 font-medium capitalize">{product.allergens.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ingredient */}
          <div>
            <h2 className="text-3xl font-medium tracking-wide mb-8 text-gray-800">
              Ingredient
            </h2>
            <p className="text-[11px] font-medium leading-loose tracking-[0.5px] text-gray-600">
              {product.ingredients || "No ingredients listed."}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProductInfo;

import React, { useEffect, useState } from 'react';
import { getProducts } from '../../services/productService';
import ProductCard from '../collection/ProductCard';

const FeaturedCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Fetch latest products as a "Featured" collection
        const data = await getProducts({ limit: 3 });
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-24 bg-[var(--color-brand-surface)] w-full">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-6 md:space-y-0 text-center md:text-left">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-[var(--color-brand-secondary)] mb-3">
              Season Essentials
            </span>
            <h2 className="text-3xl lg:text-4xl font-semibold text-[var(--color-brand-primary)] tracking-wide uppercase">
              Featured Collection
            </h2>
          </div>
          <button className="text-[10px] font-bold tracking-[2px] uppercase border-b-2 border-[var(--color-brand-primary)] pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">
            View All Products
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col space-y-4">
                <div className="aspect-square bg-gray-200"></div>
                <div className="h-4 bg-gray-200 w-3/4 self-center"></div>
                <div className="h-4 bg-gray-200 w-1/4 self-center"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCollection;

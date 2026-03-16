import React, { useEffect, useState } from 'react';
import ProductCard from '../collection/ProductCard';
import { getProducts } from '../../services/productService';

const RecommendedProducts = ({ title = "You may also like", currentProductId }) => {
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const data = await getProducts({ limit: 4 });
        if (data.success) {
          // Filter out the current product if passed, and take up to 3
          const recs = data.products
            .filter(p => p._id !== currentProductId)
            .slice(0, 3);
          setRecommended(recs);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecs();
  }, [currentProductId]);

  if (recommended.length === 0) return null;

  return (
    <section className="flex flex-col items-center w-full max-w-[1400px] mx-auto px-8 lg:px-16 mb-24">
      <h2 className="text-3xl font-semibold mb-16 text-[var(--color-brand-primary)] tracking-wide">
        {title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16 w-full max-w-5xl">
        {recommended.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedProducts;

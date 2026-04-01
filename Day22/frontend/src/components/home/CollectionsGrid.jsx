import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/categoryService';
import { Package } from 'lucide-react';

const CollectionsGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const homeCategories = categories.filter(cat => cat.showOnHome);

  if (loading || homeCategories.length === 0) return null;

  return (
    <section className="py-24 px-8 lg:px-16 w-full max-w-[1400px] mx-auto bg-[var(--color-brand-bg)]">
      <div className="flex flex-col items-center mb-16 text-center">
        <h2 className="text-3xl lg:text-4xl font-medium text-[var(--color-brand-primary)] tracking-[0.05em] mb-4">
          Our Collections
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 sm:gap-x-10 sm:gap-y-16">
        {homeCategories.map((cat) => (
          <Link 
            key={cat._id} 
            to={`/collection?category=${cat.name}`}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-full aspect-square overflow-hidden mb-6 bg-[var(--color-brand-surface)] flex items-center justify-center transition-all duration-500">
              {cat.image ? (
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <Package size={48} opacity={0.2} strokeWidth={0.5} />
              )}
            </div>
            
            <span className="text-[12px] font-bold tracking-[2px] uppercase text-[var(--color-brand-primary)] heading-font">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CollectionsGrid;

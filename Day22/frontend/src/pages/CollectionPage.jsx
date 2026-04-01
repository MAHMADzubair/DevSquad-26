import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CollectionBanner from '../components/collection/CollectionBanner';
import Sidebar from '../components/collection/Sidebar';
import ProductGrid from '../components/collection/ProductGrid';
import { getCategories } from '../services/categoryService';

const CollectionPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';

  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: initialCategory,
    flavor: '',
    rating: '',
    organic: false
  });
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Update filter if URL changes
  useEffect(() => {
    const cat = new URLSearchParams(location.search).get('category') || '';
    setFilters(prev => ({ ...prev, category: cat }));
  }, [location.search]);

  const currentCategory = categories.find(c => c.name === filters.category);

  return (
    <main className="flex-1 flex flex-col">
      <CollectionBanner 
        categoryName={filters.category} 
        categoryImage={currentCategory?.image} 
      />
      
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-16 py-12">
        {/* Mobile Filter Button */}
        <div className="flex md:hidden justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <div className="text-[10px] font-bold tracking-[2px] text-[var(--color-brand-primary)] uppercase flex items-center gap-2">
             <span className="opacity-40">Filters</span>
             {filters.category && <span>({filters.category})</span>}
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="text-[10px] font-bold tracking-[2px] uppercase bg-black text-white px-6 py-2"
          >
            {isFilterOpen ? 'Close Filters' : 'Filter & Sort'}
          </button>
        </div>

        {/* Breadcrumbs - Desktop */}
        <div className="hidden md:flex text-[10px] font-bold tracking-[2px] text-[var(--color-brand-primary)] uppercase mb-16 items-center gap-2">
           <span className="opacity-40">Home / Collections /</span>
           <span>{filters.category || 'All Products'}</span>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 relative">
          <div className={`${isFilterOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-auto`}>
            <Sidebar filters={filters} setFilters={setFilters} setPage={setPage} />
          </div>
          <ProductGrid filters={filters} sort={sort} setSort={setSort} page={page} setPage={setPage} />
        </div>
      </div>
    </main>
  );
};

export default CollectionPage;

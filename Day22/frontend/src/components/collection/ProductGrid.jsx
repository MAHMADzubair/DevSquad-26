import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { ChevronDown } from 'lucide-react';
import { getProducts } from '../../services/productService';

const ProductGrid = ({ filters = {}, sort = '', setSort, page = 1, setPage }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts({ ...filters, sort, page, limit: 9 });
        if (data.success) {
          setProducts(data.products);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [filters, sort, page]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-end mb-10 w-full pr-4 relative">
        <button 
          className="flex items-center space-x-2 text-[11px] font-semibold tracking-[0.5px] uppercase text-[var(--color-brand-primary)] hover:opacity-75 transition-opacity"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span>SORT BY {sort && `: ${sort.replace('_', ' ').toUpperCase()}`}</span>
          <ChevronDown size={14} strokeWidth={2} />
        </button>
        
        {isDropdownOpen && (
          <div className="absolute top-8 right-0 bg-white border border-gray-200 shadow-md z-10 w-40 text-[11px] font-semibold text-[var(--color-brand-primary)]">
            {['createdAt_desc', 'price_asc', 'price_desc', 'rating_desc'].map((s) => (
              <div 
                key={s} 
                className={`p-3 cursor-pointer hover:bg-gray-100 uppercase ${sort === s ? 'bg-gray-50' : ''}`}
                onClick={() => { setSort(s); setIsDropdownOpen(false); setPage(1); }}
              >
                {s.replace('_', ' ')}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Grid */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center p-20">Loading...</div>
      ) : products.length === 0 ? (
        <div className="flex-1 flex items-start justify-center p-20 text-gray-500">No products found matching filters.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-10 sm:gap-y-16">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-16 space-x-4">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-[11px] font-bold tracking-widest uppercase border border-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-4 py-2 text-[11px] font-bold tracking-widest">{page} / {totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-[11px] font-bold tracking-widest uppercase border border-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductGrid;

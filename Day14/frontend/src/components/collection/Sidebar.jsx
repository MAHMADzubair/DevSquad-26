import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const Sidebar = ({ filters, setFilters, setPage }) => {
  const filterData = [
    {
      name: "category",
      label: "COLLECTIONS",
      options: [
        "Black Tea", "Green Tea", "White Tea", "Chai", "Matcha", "Herbal Tea", "Oolong", "Rooibos"
      ]
    },
    {
      name: "flavor",
      label: "FLAVOR",
      options: [
        "Spicy", "Sweet", "Citrus", "Smooth", "Fruity", "Floral", "Grassy", "Minty", "Bitter", "Creamy"
      ]
    }
  ];

  const [expanded, setExpanded] = useState({
    category: true,
    flavor: true
  });

  const toggleExpand = (name) => {
    setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: prev[name] === value ? '' : value
    }));
    setPage(1);
  };

  const toggleOrganic = () => {
    setFilters(prev => ({ ...prev, organic: !prev.organic }));
    setPage(1);
  };

  return (
    <aside className="w-full md:w-64 md:pr-12 shrink-0 flex flex-col pt-0 md:pt-12">
      {filterData.map((filter, idx) => (
        <div key={idx} className="border-b border-gray-300 mb-5 pb-5">
          <div 
            className="flex justify-between items-center cursor-pointer hover:opacity-75 transition-opacity"
            onClick={() => toggleExpand(filter.name)}
          >
            <div className="text-[11px] font-bold tracking-[0.5px] text-[var(--color-brand-primary)] uppercase">
              {filter.label}
            </div>
            {expanded[filter.name] ? (
              <Minus size={14} strokeWidth={2} className="text-[var(--color-brand-primary)]" />
            ) : (
              <Plus size={14} strokeWidth={2} className="text-gray-500" />
            )}
          </div>
          
          <div className={`flex-col space-y-3 mt-4 pl-0.5 overflow-hidden transition-all duration-300 ease-in-out ${expanded[filter.name] ? 'max-h-[500px] flex opacity-100' : 'max-h-0 opacity-0'}`}>
            {filter.options.map((option, optIdx) => (
              <label 
                key={optIdx} 
                className="flex items-center space-x-2.5 cursor-pointer group"
                onClick={() => handleFilterChange(filter.name, option)}
              >
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={filters[filter.name] === option}
                    readOnly
                    className="peer appearance-none w-3.5 h-3.5 border border-gray-400 rounded-none checked:border-[var(--color-brand-primary)] transition-colors cursor-pointer"
                  />
                  <svg className="absolute w-[9px] h-[9px] text-[var(--color-brand-primary)] opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className={`text-[11px] font-medium tracking-[0.3px] ${filters[filter.name] === option ? 'text-black font-bold' : 'text-gray-600'} group-hover:text-black`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
      
      {/* Organic Toggle */}
      <div 
        className="flex justify-between items-center py-2 cursor-pointer hover:opacity-75 transition-opacity"
        onClick={toggleOrganic}
      >
        <span className="text-[11px] font-bold tracking-[0.5px] text-[var(--color-brand-primary)] uppercase">
          ORGANIC
        </span>
        <div className={`w-8 h-4 rounded-full border ${filters.organic ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]' : 'border-gray-400'} flex items-center px-[2px] transition-colors`}>
          <div className={`w-2.5 h-2.5 rounded-full transition-transform ${filters.organic ? 'bg-white translate-x-4' : 'bg-gray-500'}`} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

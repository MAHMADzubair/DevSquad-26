"use client";

import { useFilterStore } from "@/store/useFilterStore";
import { X } from "lucide-react";

export default function FilterBar() {
  const { filters, removeFilter, clearFilters } = useFilterStore();

  if (filters.length === 0) return null;

  return (
    <div className="sticky top-4 z-20 -mt-7 mx-auto max-w-5xl px-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 rounded-lg shadow-lg px-4 sm:px-6 py-4 border border-slate-100 dark:border-slate-700">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <span
              key={filter}
              className="flex items-center gap-0 rounded overflow-hidden text-sm font-semibold"
            >
              <span className="px-2.5 py-1 bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">
                {filter}
              </span>
              <button
                onClick={() => removeFilter(filter)}
                aria-label={`Remove filter ${filter}`}
                className="flex items-center justify-center w-7 h-full bg-teal-500 hover:bg-slate-800 dark:hover:bg-teal-300 text-white transition-colors duration-200 px-1.5 py-1"
              >
                <X size={11} strokeWidth={3} />
              </button>
            </span>
          ))}
        </div>
        <button
          onClick={clearFilters}
          className="text-sm font-semibold text-slate-400 hover:text-teal-500 dark:text-slate-400 dark:hover:text-teal-400 underline transition-colors duration-200 shrink-0"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

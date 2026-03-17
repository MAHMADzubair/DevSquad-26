import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterStore {
  filters: string[];
  addFilter: (tag: string) => void;
  removeFilter: (tag: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      filters: [],
      addFilter: (tag) =>
        set((state) => ({
          filters: state.filters.includes(tag)
            ? state.filters
            : [...state.filters, tag],
        })),
      removeFilter: (tag) =>
        set((state) => ({
          filters: state.filters.filter((f) => f !== tag),
        })),
      clearFilters: () => set({ filters: [] }),
    }),
    {
      name: "job-filters",
    }
  )
);

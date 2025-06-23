import { create } from 'zustand';
import { PlaceCategory } from '../types';

interface Filter {
  category?: PlaceCategory;
  rating?: number;
  tags?: string[];
  searchQuery?: string;
  radius: number; // Радиус в километрах
}

interface FiltersState {
  filters: Filter;
  isFiltersOpen: boolean;
  setFilter: <K extends keyof Filter>(key: K, value: Filter[K]) => void;
  clearFilters: () => void;
  toggleFiltersPanel: () => void;
}

const initialState: Filter = {
  rating: 0,
  tags: [],
  radius: 10, // Значение по умолчанию 10 км
};

export const useFiltersStore = create<FiltersState>((set) => ({
  filters: initialState,
  isFiltersOpen: true,
  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },
  clearFilters: () => set({ filters: initialState }),
  toggleFiltersPanel: () => set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
})); 
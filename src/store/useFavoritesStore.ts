import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Place } from '../types';

interface FavoritesStore {
  favorites: Place[];
  
  // Actions
  addToFavorites: (place: Place) => void;
  removeFromFavorites: (placeId: string) => void;
  isFavorite: (placeId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addToFavorites: (place) => {
        set(state => ({
          favorites: state.favorites.some(fav => fav.id === place.id)
            ? state.favorites
            : [...state.favorites, place]
        }));
      },

      removeFromFavorites: (placeId) => {
        set(state => ({
          favorites: state.favorites.filter(fav => fav.id !== placeId)
        }));
      },

      isFavorite: (placeId) => {
        return get().favorites.some(fav => fav.id === placeId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
); 
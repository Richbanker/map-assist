import { create } from 'zustand';
import { Place, UserLocation } from '../types';
import placesData from '../data/places.json';
import { searchPlacesByQuery } from '../utils/geo';
import { getCurrentUserLocation } from '../utils/geo';
import { useFiltersStore } from './useFiltersStore';

interface PlacesState {
  places: Place[];
  initialPlaces: Place[];
  selectedPlace: Place | null;
  userLocation: UserLocation | null;
  isSearching: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPlaces: () => void;
  searchPlaces: (query: string) => Promise<void>;
  fetchUserLocation: () => Promise<void>;
  selectPlace: (place: Place | null) => void;
  addPlace: (place: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePlace: (id: string, updates: Partial<Place>) => void;
  deletePlace: (id: string) => void;
  toggleFavorite: (id: string) => void;
  resetToInitial: () => void;
}

export const usePlacesStore = create<PlacesState>((set, get) => ({
  places: [],
  initialPlaces: [],
  selectedPlace: null,
  userLocation: null,
  isSearching: false,
  isLoading: false,
  error: null,

  fetchPlaces: () => {
    // Имитация задержки сети
    setTimeout(() => {
      set({ places: placesData as Place[], initialPlaces: placesData as Place[] });
    }, 200);
  },

  searchPlaces: async (query: string) => {
    // Получаем текущие фильтры и местоположение
    const { radius } = useFiltersStore.getState().filters;
    const { userLocation } = get();

    if (query.trim().length < 2) {
      set((state) => ({ places: state.initialPlaces, isSearching: false }));
      return;
    }
    set({ isSearching: true });
    const foundPlaces = await searchPlacesByQuery(query, {
      radius,
      userLocation
    });
    set({ places: foundPlaces, isSearching: false, selectedPlace: null });
  },
  
  selectPlace: (place) => set({ selectedPlace: place }),

  addPlace: (placeData) => {
    const newPlace: Place = {
      ...placeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set(state => ({ places: [...state.places, newPlace] }));
  },

  updatePlace: (id, updates) => {
    set(state => ({
      places: state.places.map(place =>
        place.id === id
          ? { ...place, ...updates, updatedAt: new Date().toISOString() }
          : place
      ),
      selectedPlace: state.selectedPlace?.id === id
        ? { ...state.selectedPlace, ...updates, updatedAt: new Date().toISOString() }
        : state.selectedPlace
    }));
  },

  deletePlace: (id) => {
    set(state => ({
      places: state.places.filter(place => place.id !== id),
      selectedPlace: state.selectedPlace?.id === id ? null : state.selectedPlace
    }));
  },

  toggleFavorite: (id) => {
    set(state => ({
      places: state.places.map(place =>
        place.id === id ? { ...place, isFavorite: !place.isFavorite } : place
      ),
      selectedPlace: state.selectedPlace?.id === id
        ? { ...state.selectedPlace, isFavorite: !state.selectedPlace.isFavorite }
        : state.selectedPlace
    }));
  },

  resetToInitial: () => {
    set(state => ({ places: state.initialPlaces, selectedPlace: null }));
  },

  fetchUserLocation: async () => {
    try {
      const location = await getCurrentUserLocation();
      set({ userLocation: location });

      const userPlace: Place = {
        id: 'user-location',
        name: 'Мое местоположение',
        coordinates: [location.latitude, location.longitude],
        category: 'other',
        address: 'Вы здесь',
        description: 'Ваше текущее местоположение',
        rating: 5,
        isFavorite: false,
        images: [],
        tags: ['you are here'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Добавляем маркер пользователя в начало списка (чтобы он был виден)
      // и сразу же выбираем его, чтобы карта на него переместилась.
      set(state => ({
        places: [userPlace, ...state.initialPlaces],
      }));
      get().selectPlace(userPlace);

    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  }
})); 
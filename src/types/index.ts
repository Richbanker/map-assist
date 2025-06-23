export interface Place {
  id: string;
  name: string;
  description: string;
  category: PlaceCategory;
  coordinates: [number, number]; // [latitude, longitude]
  address: string;
  rating: number;
  isFavorite: boolean;
  images: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type PlaceCategory = 
  | 'restaurant'
  | 'cafe'
  | 'shop'
  | 'entertainment'
  | 'culture'
  | 'nature'
  | 'transport'
  | 'other';

export interface Filter {
  category?: PlaceCategory;
  rating?: number;
  tags?: string[];
  searchQuery?: string;
  radius?: number; // в километрах
}

export interface MapState {
  center: [number, number];
  zoom: number;
  selectedPlaceId?: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
} 
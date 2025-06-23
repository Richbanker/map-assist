import { renderHook, act } from '@testing-library/react';
import { usePlacesStore } from '../usePlacesStore';
import { Place } from '../../types';

const mockPlace: Place = {
  id: '1',
  name: 'Test Place',
  description: 'Test Description',
  category: 'restaurant',
  coordinates: [55.7558, 37.6176],
  address: 'Test Address',
  rating: 4.5,
  images: [],
  tags: [],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  isFavorite: false
};

describe('usePlacesStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => usePlacesStore());
    act(() => {
      result.current.resetToInitial();
    });
  });

  test('should add a place', () => {
    const { result } = renderHook(() => usePlacesStore());

    act(() => {
      result.current.addPlace({
        name: mockPlace.name,
        description: mockPlace.description,
        category: mockPlace.category,
        coordinates: mockPlace.coordinates,
        address: mockPlace.address,
        rating: mockPlace.rating,
        images: mockPlace.images,
        tags: mockPlace.tags,
        isFavorite: mockPlace.isFavorite
      });
    });

    expect(result.current.places.length).toBe(1);
    expect(result.current.places[0].name).toBe('Test Place');
  });

  test('should remove a place', () => {
    const { result } = renderHook(() => usePlacesStore());

    act(() => {
      result.current.addPlace({
        name: mockPlace.name,
        description: mockPlace.description,
        category: mockPlace.category,
        coordinates: mockPlace.coordinates,
        address: mockPlace.address,
        rating: mockPlace.rating,
        images: mockPlace.images,
        tags: mockPlace.tags,
        isFavorite: mockPlace.isFavorite
      });
    });
    const id = result.current.places[0].id;
    act(() => {
      result.current.deletePlace(id);
    });
    expect(result.current.places.length).toBe(0);
  });

  test('should update a place', () => {
    const { result } = renderHook(() => usePlacesStore());

    act(() => {
      result.current.addPlace({
        name: mockPlace.name,
        description: mockPlace.description,
        category: mockPlace.category,
        coordinates: mockPlace.coordinates,
        address: mockPlace.address,
        rating: mockPlace.rating,
        images: mockPlace.images,
        tags: mockPlace.tags,
        isFavorite: mockPlace.isFavorite
      });
    });
    const id = result.current.places[0].id;
    act(() => {
      result.current.updatePlace(id, { name: 'Updated Place' });
    });
    expect(result.current.places[0].name).toBe('Updated Place');
  });
}); 
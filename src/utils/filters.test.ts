import { applyFilters, sortPlaces } from './filters';
import type { Place } from '../types';

const base: Place = {
  id: '1',
  name: 'Кофейня Север',
  description: 'Свежий кофе',
  category: 'cafe',
  coordinates: [55.75, 37.61],
  address: 'Лесная улица',
  rating: 4.8,
  isFavorite: false,
  images: [],
  tags: ['кофе', 'завтрак'],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const places: Place[] = [
  { ...base, id: '2', name: 'Парк', category: 'nature', tags: ['прогулка'], rating: 4.9 },
  base,
  { ...base, id: '3', name: 'Кофейня Юг', rating: 3.5, tags: ['кофе'] },
];

describe('place filters', () => {
  it('combines category, rating, tags and normalized search', () => {
    expect(
      applyFilters(places, {
        category: 'cafe',
        rating: 4.5,
        tags: ['завтрак', 'терраса'],
        searchQuery: '  СЕВЕР  ',
      }).map((place) => place.id)
    ).toEqual(['1']);
  });

  it('returns an empty array when no place meets the filters', () => {
    expect(applyFilters(places, { category: 'shop' })).toEqual([]);
  });

  it('includes a rating equal to the minimum', () => {
    expect(applyFilters(places, { rating: 4.8 }).map((place) => place.id)).toEqual(['2', '1']);
  });

  it('does not mutate the original list when sorting', () => {
    expect(sortPlaces(places, 'rating').map((place) => place.id)).toEqual(['2', '1', '3']);
    expect(places.map((place) => place.id)).toEqual(['2', '1', '3']);
    expect(sortPlaces([...places].reverse(), 'rating').map((place) => place.id)).toEqual(['2', '1', '3']);
  });
});

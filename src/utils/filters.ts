import { Place, Filter } from '../types';

/**
 * Применяет фильтры к списку мест
 */
export function applyFilters(places: Place[], filters: Filter): Place[] {
  let filteredPlaces = [...places];

  // Фильтр по категории
  if (filters.category) {
    filteredPlaces = filteredPlaces.filter(place => place.category === filters.category);
  }

  // Фильтр по рейтингу
  if (filters.rating) {
    filteredPlaces = filteredPlaces.filter(place => place.rating >= filters.rating!);
  }

  // Фильтр по тегам
  if (filters.tags && filters.tags.length > 0) {
    filteredPlaces = filteredPlaces.filter(place =>
      filters.tags!.some(tag => place.tags.includes(tag))
    );
  }

  // Фильтр по поисковому запросу
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filteredPlaces = filteredPlaces.filter(place =>
      place.name.toLowerCase().includes(query) ||
      place.description.toLowerCase().includes(query) ||
      place.address.toLowerCase().includes(query) ||
      place.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  return filteredPlaces;
}

/**
 * Получает уникальные категории из списка мест
 */
export function getUniqueCategories(places: Place[]): string[] {
  const categories = new Set(places.map(place => place.category));
  return Array.from(categories);
}

/**
 * Получает уникальные теги из списка мест
 */
export function getUniqueTags(places: Place[]): string[] {
  const tags = new Set<string>();
  places.forEach(place => {
    place.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags);
}

/**
 * Сортирует места по различным критериям
 */
export function sortPlaces(places: Place[], sortBy: 'name' | 'rating' | 'createdAt'): Place[] {
  return [...places].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });
} 
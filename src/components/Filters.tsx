import { useState, useEffect } from 'react';
import { useFiltersStore } from '../store/useFiltersStore';
import { usePlacesStore } from '../store/usePlacesStore';
import { getUniqueCategories, getUniqueTags } from '../utils/filters';
import { useDebounce } from '../hooks/useDebounce';
import { PlaceCategory } from '../types';

const Filters = ({ toggleFiltersPanel }: { toggleFiltersPanel: () => void }) => {
  const { filters, setFilter, clearFilters } = useFiltersStore();
  const { initialPlaces, searchPlaces, isSearching, resetToInitial } = usePlacesStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Дебаунсим и поисковый запрос, и радиус
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedRadius = useDebounce(filters.radius, 500); // <-- Новое

  const categories = getUniqueCategories(initialPlaces);
  const tags = getUniqueTags(initialPlaces);

  useEffect(() => {
    // Выполняем поиск, если есть текст запроса.
    // Зависимость от debouncedRadius вызовет повторный поиск при изменении радиуса.
    if (debouncedSearchQuery) {
      searchPlaces(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, debouncedRadius, searchPlaces]); // <-- Добавили debouncedRadius

  const handleClearFilters = () => {
    clearFilters();
    setSearchQuery('');
    resetToInitial();
  };

  const categoryLabels: Record<PlaceCategory, string> = {
    restaurant: 'Рестораны', cafe: 'Кафе', shop: 'Магазины',
    entertainment: 'Развлечения', culture: 'Культура', nature: 'Природа',
    transport: 'Транспорт', other: 'Другое'
  };

  return (
    <div className="fixed top-20 bottom-4 left-14 z-[1000] bg-brand-surface rounded-2xl shadow-lg border border-brand-border w-80 flex flex-col">
      <div className="p-6 border-b border-brand-border">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-brand-text-primary">Фильтры и Поиск</h3>
          <button onClick={toggleFiltersPanel} className="text-brand-text-secondary hover:text-brand-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-brand-text-primary mb-2">Глобальный поиск</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Город, улица, место..."
              className="w-full form-input rounded-md border-brand-border focus:ring-brand-primary focus:border-brand-primary transition pr-10"
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="animate-spin h-5 w-5 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Radius Slider */}
        <div>
          <label htmlFor="radius" className="block text-sm font-medium text-brand-text-primary mb-2">
            Радиус поиска: <span className="font-bold">{filters.radius} км</span>
          </label>
          <input
            id="radius"
            type="range"
            min="1"
            max="50"
            step="1"
            value={filters.radius}
            onChange={(e) => setFilter('radius', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-brand-text-primary mb-2">Категория</label>
          <select
            value={filters.category || ''}
            onChange={(e) => setFilter('category', e.target.value as PlaceCategory)}
            className="w-full form-select rounded-md border-brand-border focus:ring-brand-primary focus:border-brand-primary transition"
          >
            <option value="">Все категории</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{categoryLabels[cat as PlaceCategory]}</option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-brand-text-primary mb-2">Минимальный рейтинг</label>
          <select
            value={filters.rating || ''}
            onChange={(e) => setFilter('rating', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full form-select rounded-md border-brand-border focus:ring-brand-primary focus:border-brand-primary transition"
          >
            <option value="">Любой</option>
            <option value="4">4+</option>
            <option value="4.5">4.5+</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-brand-text-primary mb-2">Теги</label>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {tags.map((tag) => (
              <label key={tag} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.tags?.includes(tag) || false}
                  onChange={(e) => {
                    const current = filters.tags || [];
                    const newTags = e.target.checked ? [...current, tag] : current.filter(t => t !== tag);
                    setFilter('tags', newTags);
                  }}
                  className="h-4 w-4 rounded form-checkbox text-brand-primary focus:ring-brand-primary/50 border-brand-border transition"
                />
                <span className="ml-3 text-sm text-brand-text-secondary">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-brand-border mt-auto">
        <div className="flex space-x-3">
          <button
            onClick={handleClearFilters}
            className="w-full px-4 py-3 text-sm font-semibold bg-brand-background border border-brand-border rounded-lg text-brand-text-secondary hover:bg-gray-200 transition-colors"
          >
            Сбросить
          </button>
          <button
            onClick={toggleFiltersPanel}
            className="w-full px-4 py-3 text-sm font-semibold bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/30"
          >
            Применить фильтры
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters; 
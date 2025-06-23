import { usePlacesStore } from '../store/usePlacesStore';
import { useFiltersStore } from '../store/useFiltersStore';
import { applyFilters } from '../utils/filters';
import PlaceCard from '../features/place/PlaceCard';

const Sidebar = () => {
  const { places, selectPlace, selectedPlace } = usePlacesStore();
  const { filters } = useFiltersStore();
  
  const filteredPlaces = applyFilters(places, filters);

  return (
    <div className="fixed right-4 top-20 bottom-4 z-[1000] bg-brand-surface rounded-2xl shadow-lg border border-brand-border w-96 flex flex-col">
      <div className="p-6 border-b border-brand-border">
        <h2 className="text-xl font-bold text-brand-text-primary">
          Места рядом ({filteredPlaces.length})
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onClick={() => selectPlace(place)}
              isSelected={selectedPlace?.id === place.id}
            />
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-brand-text-secondary">Места не найдены</p>
            <p className="text-sm text-gray-400 mt-1">Попробуйте изменить фильтры</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 

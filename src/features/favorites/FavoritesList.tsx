import { useFavoritesStore } from '../../store/useFavoritesStore';
import PlaceCard from '../place/PlaceCard';

const FavoritesList = () => {
  const { favorites, clearFavorites } = useFavoritesStore();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-8xl mb-6">❤️</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Избранных мест пока нет
        </h2>
        <p className="text-gray-500">
          Добавляйте места в избранное, чтобы быстро находить их позже
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Избранные места ({favorites.length})
        </h2>
        <button
          onClick={clearFavorites}
          className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 transition-colors"
        >
          Очистить все
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesList; 

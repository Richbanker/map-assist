import Header from '../components/Header';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { Link } from 'react-router-dom';
import { PlaceCategory } from '../types';

const FavoritesPage = () => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavoritesStore();

  const categoryLabels: Record<PlaceCategory, string> = {
    restaurant: '🍽️',
    cafe: '☕',
    shop: '🛍️',
    entertainment: '🎮',
    culture: '🎭',
    nature: '🌳',
    transport: '🚇',
    other: '📍'
  };

  return (
    <div className="min-h-screen bg-brand-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Избранные места</h1>
          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 transition-colors"
            >
              Очистить все
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-8xl mb-6">❤️</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Избранных мест пока нет
            </h2>
            <p className="text-gray-500 mb-6">
              Добавляйте места в избранное, чтобы быстро находить их позже
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Перейти к карте
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((place) => (
              <div
                key={place.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {categoryLabels[place.category]}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {place.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => removeFromFavorites(place.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {place.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">{place.address}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600 ml-1">{place.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {place.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/place/${place.id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Подробнее
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage; 

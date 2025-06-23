import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { usePlacesStore } from '../store/usePlacesStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { Place, PlaceCategory } from '../types';

const PlacePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Получаем и полные, и начальные данные
  const { places, initialPlaces, selectPlace } = usePlacesStore();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesStore();
  
  // Ищем место в текущем списке, а если его там нет - в начальном
  const [place, setPlace] = useState<Place | null>(null);

  useEffect(() => {
    const foundPlace = places.find((p) => p.id === id) || initialPlaces.find((p) => p.id === id);
    if (foundPlace) {
      setPlace(foundPlace);
      // Принудительно выбираем это место, чтобы карта центрировалась, если мы пришли по прямой ссылке
      selectPlace(foundPlace); 
    }
  }, [id, places, initialPlaces, selectPlace]);
  
  // Если место еще не загружено, показываем индикатор
  if (!place) {
    return (
      <div className="min-h-screen bg-brand-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Место не найдено
            </h1>
            <p className="text-gray-500 mb-8">
              Запрашиваемое место не существует или было удалено
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Вернуться к карте
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

  const favorite = isFavorite(place.id);

  const handleToggleFavorite = () => {
    if (favorite) {
      removeFromFavorites(place.id);
    } else {
      addToFavorites(place);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад
          </button>
        </div>

        {/* Галерея изображений */}
        {place.images && place.images.length > 0 && (
          <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
            <img
              src={place.images[0]}
              alt=""
              className="w-full h-64 object-cover"
            />
            {place.images.length > 1 && (
              <div className="grid grid-cols-3 gap-1 mt-1">
                {place.images.slice(1, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt=""
                    className="w-full h-32 object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Заголовок */}
          <div className="p-8 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl">{categoryLabels[place.category]}</span>
                  <h1 className="text-3xl font-bold text-gray-900">{place.name}</h1>
                </div>
                <p className="text-gray-600 text-lg mb-4">{place.description}</p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-xl">★</span>
                    <span className="text-lg text-gray-700 ml-2">{place.rating}</span>
                  </div>
                  <span className="text-gray-500">{place.address}</span>
                </div>
              </div>
              <button
                onClick={handleToggleFavorite}
                className={`p-3 rounded-full transition-colors ${
                  favorite
                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                    : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <svg className="w-6 h-6" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Теги */}
          <div className="p-8 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Теги</h3>
            <div className="flex flex-wrap gap-2">
              {place.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Координаты */}
          <div className="p-8 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Координаты</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Широта</span>
                <p className="text-lg font-mono">{place.coordinates[0]}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Долгота</span>
                <p className="text-lg font-mono">{place.coordinates[1]}</p>
              </div>
            </div>
          </div>

          {/* Даты */}
          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Создано</span>
                <p className="text-sm">{new Date(place.createdAt).toLocaleDateString('ru-RU')}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Обновлено</span>
                <p className="text-sm">{new Date(place.updatedAt).toLocaleDateString('ru-RU')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacePage; 

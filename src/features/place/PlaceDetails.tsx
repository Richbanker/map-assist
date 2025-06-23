 
import { Place } from '../../types';
import { PlaceCategory } from '../../types';

interface PlaceDetailsProps {
  place: Place;
}

const PlaceDetails = ({ place }: PlaceDetailsProps) => {
  const categoryLabels: Record<PlaceCategory, string> = {
    restaurant: '🍽️ Ресторан',
    cafe: '☕ Кафе',
    shop: '🛍️ Магазин',
    entertainment: '🎮 Развлечения',
    culture: '🎭 Культура',
    nature: '🌳 Природа',
    transport: '🚇 Транспорт',
    other: '📍 Другое'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">{categoryLabels[place.category].split(' ')[0]}</span>
          <h2 className="text-2xl font-bold text-gray-900">{place.name}</h2>
        </div>
        
        <p className="text-gray-600 mb-6">{place.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Основная информация</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Адрес</span>
                <p className="text-gray-900">{place.address}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Рейтинг</span>
                <div className="flex items-center">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="text-gray-900 ml-2">{place.rating}</span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Координаты</span>
                <p className="text-gray-900 font-mono text-sm">
                  {place.coordinates[0]}, {place.coordinates[1]}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Теги</h3>
            <div className="flex flex-wrap gap-2">
              {place.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Даты</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Создано</span>
                  <p className="text-gray-900 text-sm">
                    {new Date(place.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Обновлено</span>
                  <p className="text-gray-900 text-sm">
                    {new Date(place.updatedAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails; 

import { Place, UserLocation } from '../types';
import { PlaceCategory } from '../types';

/**
 * Вычисляет расстояние между двумя точками в километрах (формула гаверсинуса)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Радиус Земли в километрах
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Получает текущую геолокацию пользователя
 */
export function getUserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Геолокация не поддерживается'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}

/**
 * Фильтрует места по расстоянию от пользователя
 */
export function filterPlacesByDistance(
  places: Place[],
  userLocation: UserLocation,
  maxDistance: number
): Place[] {
  return places.filter(place => {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      place.coordinates[0],
      place.coordinates[1]
    );
    return distance <= maxDistance;
  });
}

/**
 * Сортирует места по расстоянию от пользователя
 */
export function sortPlacesByDistance(
  places: Place[],
  userLocation: UserLocation
): Place[] {
  return [...places].sort((a, b) => {
    const distanceA = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      a.coordinates[0],
      a.coordinates[1]
    );
    const distanceB = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      b.coordinates[0],
      b.coordinates[1]
    );
    return distanceA - distanceB;
  });
}

// Nominatim API возвращает много полей. Нас интересуют эти.
interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  // Это может быть "restaurant", "cafe" и т.д.
  // Мы будем сопоставлять это с нашими категориями.
  type: string;
  // Более детальная категория, например "amenity"
  class: string;
  name?: string; // Иногда имя находится в display_name
}

// Сопоставление типов/классов Nominatim с нашими PlaceCategory
const mapNominatimTypeToCategory = (type: string, cls: string): PlaceCategory => {
  if (cls === 'amenity') {
    switch (type) {
      case 'restaurant':
      case 'fast_food':
      case 'food_court':
        return 'restaurant';
      case 'cafe':
        return 'cafe';
      case 'bar':
      case 'pub':
        return 'restaurant'; // Или новая категория
    }
  }
  if (cls === 'shop') {
    return 'shop';
  }
  if (cls === 'tourism' || cls === 'historic') {
    if (type === 'museum' || type === 'theatre' || type === 'artwork') {
      return 'culture';
    }
  }
  if (cls === 'leisure') {
    if (type === 'park' || type === 'nature_reserve' || type === 'garden') {
      return 'nature';
    }
    return 'entertainment';
  }
  if (cls === 'public_transport' || type === 'station') {
    return 'transport';
  }

  // Резервный вариант
  if (type === 'restaurant') return 'restaurant';
  if (type === 'cafe') return 'cafe';
  if (type === 'shop') return 'shop';
  if (type === 'park' || type === 'nature_reserve') return 'nature';

  return 'other';
};

interface SearchOptions {
  radius?: number;
  userLocation?: UserLocation | null;
}

/**
 * Ищет места с помощью Nominatim API.
 * @param query Поисковый запрос.
 * @param options Опции поиска, включая радиус и местоположение.
 * @returns Промис, который разрешается массивом объектов Place.
 */
export const searchPlacesByQuery = async (query: string, options: SearchOptions = {}): Promise<Place[]> => {
  const { radius, userLocation } = options;

  if (query.trim().length < 3) {
    return [];
  }

  const email = 'your-email-for-nominatim@example.com';
  let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query
  )}&format=json&addressdetails=1&extratags=1&namedetails=1&accept-language=ru`;

  // Добавляем viewbox, если есть местоположение и радиус
  if (userLocation && radius) {
    const lat = userLocation.latitude;
    const lon = userLocation.longitude;
    // Очень грубая конвертация км в градусы для viewbox
    const radiusInDegrees = radius / 111.32; 
    const lon1 = lon - radiusInDegrees;
    const lat1 = lat - radiusInDegrees;
    const lon2 = lon + radiusInDegrees;
    const lat2 = lat + radiusInDegrees;
    url += `&viewbox=${lon1},${lat1},${lon2},${lat2}&bounded=1`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': `MapAssistApp/1.0 (${email})`,
      },
    });

    if (!response.ok) {
      console.error('Ошибка запроса к Nominatim API:', response.statusText);
      return [];
    }

    const results: NominatimResult[] = await response.json();

    // Преобразуем результаты Nominatim в наш формат Place
    const places: Place[] = results.map((result) => {
      const displayNameParts = result.display_name.split(',');
      const name = result.name || displayNameParts[0] || 'Неизвестное место';
      const address = result.display_name;

      return {
        id: `nominatim-${result.place_id}`,
        name: name,
        description: `Найдено через поиск: ${result.display_name}`,
        category: mapNominatimTypeToCategory(result.type, result.class),
        coordinates: [parseFloat(result.lat), parseFloat(result.lon)],
        address: address,
        rating: 0, // Nominatim не предоставляет рейтинги
        isFavorite: false,
        images: [],
        tags: [result.type, result.class].filter(Boolean), // Используем type и class как теги
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    return places;
  } catch (error) {
    console.error('Ошибка при получении данных от Nominatim:', error);
    return [];
  }
};

/**
 * Получает текущее местоположение пользователя с помощью Geolocation API.
 * @returns Промис, который разрешается объектом UserLocation.
 */
export const getCurrentUserLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Геолокация не поддерживается вашим браузером.'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('Вы запретили доступ к своему местоположению.'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('Информация о местоположении недоступна.'));
              break;
            case error.TIMEOUT:
              reject(new Error('Время ожидания запроса на геолокацию истекло.'));
              break;
            default:
              reject(new Error('Произошла неизвестная ошибка при определении местоположения.'));
              break;
          }
        }
      );
    }
  });
}; 
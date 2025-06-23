import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Place } from '../types';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { Link } from 'react-router-dom';

interface PlaceMarkerProps {
  place: Place;
  icon: Icon;
  isSelected?: boolean;
  onClick: () => void;
}

const PlaceMarker = ({ place, icon, isSelected = false, onClick }: PlaceMarkerProps) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(place.id);

  // Создаем копию иконки, чтобы изменять ее стиль
  const markerIcon = new Icon({ ...icon.options });

  if (isSelected) {
    // Делаем иконку больше и ярче, если она выбрана
    markerIcon.options.iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
    markerIcon.options.iconSize = [35, 51];
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(place.id);
    } else {
      addToFavorites(place);
    }
  };

  return (
    <Marker
      position={place.coordinates}
      icon={markerIcon}
      eventHandlers={{
        click: () => {
          onClick();
        },
      }}
    >
      <Popup>
        <div className="p-2 min-w-[200px]">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-sm">{place.name}</h3>
            <button
              onClick={handleToggleFavorite}
              className={`ml-2 p-1 rounded-full transition-colors ${
                favorite
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <svg
                className="w-4 h-4"
                fill={favorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-600 text-xs mb-2">{place.description}</p>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">{place.address}</span>
            <div className="flex items-center">
              <span className="text-yellow-500 text-xs">★</span>
              <span className="text-xs text-gray-600 ml-1">{place.rating}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {place.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-brand-secondary/30 text-brand-primary text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <Link
            to={`/place/${place.id}`}
            className="block w-full text-center bg-blue-600 text-white text-xs py-2 px-3 rounded-md hover:bg-blue-700 transition-colors"
            style={{ color: 'white' }}
          >
            Подробнее
          </Link>
        </div>
      </Popup>
    </Marker>
  );
};

export default PlaceMarker; 

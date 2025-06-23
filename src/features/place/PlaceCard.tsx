import React from 'react';
import { Place } from '../../types';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { Link } from 'react-router-dom';
import { PlaceCategory } from '../../types';

interface PlaceCardProps {
  place: Place;
  isSelected?: boolean;
  onClick?: () => void;
  onToggleFavorite?: (id: string) => void;
}

const categoryStyles: Record<PlaceCategory, { icon: string; color: string }> = {
  restaurant: { icon: '🍽️', color: 'bg-red-100 text-red-800' },
  cafe: { icon: '☕', color: 'bg-yellow-100 text-yellow-800' },
  shop: { icon: '🛍️', color: 'bg-blue-100 text-blue-800' },
  entertainment: { icon: '🎮', color: 'bg-purple-100 text-purple-800' },
  culture: { icon: '🎭', color: 'bg-indigo-100 text-indigo-800' },
  nature: { icon: '🌳', color: 'bg-green-100 text-green-800' },
  transport: { icon: '🚇', color: 'bg-gray-100 text-gray-800' },
  other: { icon: '📍', color: 'bg-pink-100 text-pink-800' },
};

const PlaceCard = ({ place, isSelected = false, onClick, onToggleFavorite }: PlaceCardProps) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(place.id);
  const { icon, color } = categoryStyles[place.category];

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(place.id);
    } else {
      if (favorite) {
        removeFromFavorites(place.id);
      } else {
        addToFavorites(place);
      }
    }
  };

  return (
    <Link
      to={`/place/${place.id}`}
      onClick={onClick}
      className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${
        isSelected
          ? 'bg-brand-primary/10 border-brand-primary'
          : 'bg-brand-surface border-brand-border hover:border-brand-secondary/50'
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${color}`}>
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-bold text-brand-text-primary">{place.name}</h3>
            <div className="flex items-center text-sm text-brand-text-secondary">
              <span className="text-brand-accent mr-1">★</span>
              <span>{place.rating}</span>
            </div>
          </div>
          <p className="text-sm text-brand-text-secondary mt-1">{place.address}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {place.tags?.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-brand-background text-brand-text-secondary text-xs rounded-full border border-brand-border">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={handleToggleFavorite}
          className={`p-2 rounded-full transition-colors z-10 relative ${
            favorite ? 'text-red-500 bg-red-100' : 'text-gray-400 hover:bg-gray-100'
          }`}
        >
          <svg 
            className="w-5 h-5" 
            fill={favorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            data-testid={favorite ? 'heart-filled' : 'heart-outline'}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </Link>
  );
};

export default PlaceCard; 

import { useState } from 'react';
import { usePlacesStore } from '../store/usePlacesStore';

const MyLocationButton = () => {
  const { fetchUserLocation } = usePlacesStore();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = async () => {
    if (isLocating) return;
    setIsLocating(true);
    try {
      await fetchUserLocation();
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <button
      onClick={handleLocate}
      disabled={isLocating}
      aria-busy={isLocating}
      className="bg-brand-surface p-3 rounded-full shadow-lg border border-brand-border hover:shadow-xl transition-all hover:bg-brand-primary/10 disabled:opacity-50 disabled:cursor-wait"
      aria-label="Мое местоположение"
      title="Мое местоположение"
    >
      <svg className="w-5 h-5 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

export default MyLocationButton; 
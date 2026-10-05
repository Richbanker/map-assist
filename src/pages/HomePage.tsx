import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Map from '../components/Map';
import Filters from '../components/Filters';
import Sidebar from '../components/Sidebar';
import { usePlacesStore } from '../store/usePlacesStore';
import MyLocationButton from '../components/MyLocationButton';

const HomePage = () => {
  const { fetchPlaces } = usePlacesStore();
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  useEffect(() => {
    // При первой загрузке страницы, получаем начальные места
    fetchPlaces();
  }, [fetchPlaces]);

  const toggleFiltersPanel = () => setIsFiltersOpen((prev) => !prev);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative">
        <Map />
        {isFiltersOpen ? (
          <Filters toggleFiltersPanel={toggleFiltersPanel} />
        ) : (
          <div className="fixed top-20 left-14 z-[1000] flex flex-col space-y-2">
            <button
              onClick={toggleFiltersPanel}
              className="bg-brand-surface p-3 rounded-full shadow-lg border border-brand-border hover:shadow-xl transition-all hover:bg-brand-primary/10"
              aria-label="Открыть фильтры"
            >
              <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            <MyLocationButton />
          </div>
        )}
        <Sidebar />
      </main>
    </div>
  );
};

export default HomePage; 

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { usePlacesStore } from './store/usePlacesStore';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import PlacePage from './pages/PlacePage';

function App() {
  const { fetchPlaces } = usePlacesStore();

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-brand-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/place/:id" element={<PlacePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 

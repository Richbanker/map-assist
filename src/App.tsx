import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
          <Route
            path="*"
            element={(
              <main className="mx-auto max-w-lg px-6 py-16 text-center">
                <h1 className="text-2xl font-bold text-brand-text-primary">Страница не найдена</h1>
                <p className="mt-3 text-brand-text-secondary">Проверьте адрес или вернитесь к карте.</p>
                <Link to="/" className="mt-6 inline-block rounded-md bg-brand-primary px-4 py-2 text-white">
                  Вернуться к карте
                </Link>
              </main>
            )}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 

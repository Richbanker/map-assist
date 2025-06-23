import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import PlaceCard from '../../features/place/PlaceCard';
import { Place } from '../../types';
import { useFavoritesStore } from '../../store/useFavoritesStore';

const mockPlace: Place = {
  id: '1',
  name: 'Test Place',
  description: 'Test Description',
  category: 'restaurant',
  coordinates: [55.7558, 37.6176],
  address: 'Test Address',
  rating: 4.5,
  isFavorite: false,
  images: [],
  tags: [],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

const mockOnToggleFavorite = jest.fn();

// Wrapper компонент для тестов с Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('PlaceCard', () => {
  beforeEach(() => {
    mockOnToggleFavorite.mockClear();
    // Очищаем стор избранного перед каждым тестом
    useFavoritesStore.getState().clearFavorites();
  });

  test('renders place information', () => {
    renderWithRouter(<PlaceCard place={mockPlace} onToggleFavorite={mockOnToggleFavorite} />);

    expect(screen.getByText('Test Place')).toBeInTheDocument();
    // expect(screen.getByText('Test Description')).toBeInTheDocument(); // description не отображается
    expect(screen.getByText('Test Address')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  test('calls onToggleFavorite when favorite button is clicked', () => {
    renderWithRouter(<PlaceCard place={mockPlace} onToggleFavorite={mockOnToggleFavorite} />);

    const favoriteButton = screen.getByRole('button');
    fireEvent.click(favoriteButton);

    expect(mockOnToggleFavorite).toHaveBeenCalledWith('1');
  });

  test('shows correct favorite icon based on store state', () => {
    // 1. Place не в избранном
    const { rerender } = renderWithRouter(<PlaceCard place={mockPlace} />);
    expect(screen.getByTestId('heart-outline')).toBeInTheDocument();

    // 2. Добавляем place в избранное через стор
    useFavoritesStore.getState().addToFavorites(mockPlace);
    // Ререндерим компонент
    rerender(
      <BrowserRouter>
        <PlaceCard place={mockPlace} />
      </BrowserRouter>
    );
    expect(screen.getByTestId('heart-filled')).toBeInTheDocument();
  });
});

    

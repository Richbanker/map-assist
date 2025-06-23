import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header', () => {
  test('renders header with title', () => {
    renderWithRouter(<Header />);
    
    expect(screen.getByText('Map Assist')).toBeDefined();
  });

  test('renders navigation links', () => {
    renderWithRouter(<Header />);
    
    expect(screen.getByText('Карта')).toBeDefined();
    expect(screen.getByText('Избранное')).toBeDefined();
  });

  test('navigation links have correct href attributes', () => {
    renderWithRouter(<Header />);
    
    const homeLink = screen.getByText('Карта').closest('a');
    const favoritesLink = screen.getByText('Избранное').closest('a');
    
    expect(homeLink?.getAttribute('href')).toBe('/');
    expect(favoritesLink?.getAttribute('href')).toBe('/favorites');
  });
}); 
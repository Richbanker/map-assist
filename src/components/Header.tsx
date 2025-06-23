import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-brand-surface border-b border-brand-border z-[1001] relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-brand-text-primary">
            <div className="bg-brand-primary p-2 rounded-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="font-bold text-lg">Map Assist</span>
          </Link>

          <nav className="flex items-center space-x-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : 'text-brand-text-secondary hover:bg-brand-primary/10 hover:text-brand-primary'
                }`
              }
            >
              Карта
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : 'text-brand-text-secondary hover:bg-brand-primary/10 hover:text-brand-primary'
                }`
              }
            >
              Избранное
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 

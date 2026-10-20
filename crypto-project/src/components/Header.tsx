import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onSearch?: (query: string) => void;
}

export const Header = ({ 
  title = "Crypto Tracker", 
  subtitle = "Real-time cryptocurrency prices and market data",
  onSearch
}: HeaderProps) => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <header className="bg-bg border-b border-line sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-fg">{title}</h1>
            <p className="text-fg-muted text-sm">{subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-accent-fg rounded-lg font-medium transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="flex items-center w-full max-w-md">
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-line bg-surface text-fg placeholder-fg-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <svg className="w-5 h-5 text-fg-subtle -ml-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

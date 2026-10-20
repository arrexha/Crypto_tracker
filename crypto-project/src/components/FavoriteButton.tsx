import { MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

interface FavoriteButtonProps {
  cryptoId: string;
  className?: string;
}

export const FavoriteButton = ({ cryptoId, className = '' }: FavoriteButtonProps) => {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const active = isFavorite(cryptoId);

  const handleClick = (e: MouseEvent) => {
    // The button sits inside the card's <Link>; don't navigate to the coin
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleFavorite(cryptoId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? 'Remove from watchlist' : 'Add to watchlist'}
      title={active ? 'Remove from watchlist' : 'Add to watchlist'}
      className={`p-1 rounded-full transition hover:scale-110 ${className}`}
    >
      <svg
        className={`w-6 h-6 ${active ? 'text-yellow-400' : 'text-fg-subtle'}`}
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinejoin="round"
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    </button>
  );
};

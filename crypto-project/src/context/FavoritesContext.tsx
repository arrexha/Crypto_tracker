import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { favoritesApi, UnauthorizedError } from '../api/backend';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Set<string>;
  isFavorite: (cryptoId: string) => boolean;
  toggleFavorite: (cryptoId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const { token, logout } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleError = useCallback(
    (err: unknown) => {
      if (err instanceof UnauthorizedError) {
        logout();
      }
      console.error('Favorites error: ', err);
    },
    [logout]
  );

  useEffect(() => {
    if (!token) {
      setFavorites(new Set());
      return;
    }

    let isMounted = true;
    favoritesApi
      .getAll(token)
      .then((ids) => {
        if (isMounted) setFavorites(new Set(ids));
      })
      .catch(handleError);

    return () => {
      isMounted = false;
    };
  }, [token, handleError]);

  const toggleFavorite = async (cryptoId: string) => {
    if (!token) return;

    const wasFavorite = favorites.has(cryptoId);
    const update = (add: boolean) =>
      setFavorites((prev) => {
        const next = new Set(prev);
        if (add) next.add(cryptoId);
        else next.delete(cryptoId);
        return next;
      });

    // Optimistic update, reverted if the request fails
    update(!wasFavorite);
    try {
      if (wasFavorite) await favoritesApi.remove(token, cryptoId);
      else await favoritesApi.add(token, cryptoId);
    } catch (err) {
      update(wasFavorite);
      handleError(err);
    }
  };

  const value = {
    favorites,
    isFavorite: (cryptoId: string) => favorites.has(cryptoId),
    toggleFavorite,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

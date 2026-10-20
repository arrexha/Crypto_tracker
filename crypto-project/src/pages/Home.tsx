import { useEffect, useState } from "react";
import { fetchCryptos } from "../api/coinGecko";
import { CryptoCard, Header, ErrorModal } from "../components";
import { CryptoData } from "../types";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

export const Home = () => {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const { isAuthenticated } = useAuth();
  const { favorites } = useFavorites();

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await fetchCryptos();
        if (isMounted) {
          setCryptos(data);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const showingWatchlist = isAuthenticated && watchlistOnly;

  const filteredCryptos = cryptos.filter((crypto) =>
    (!showingWatchlist || favorites.has(crypto.id)) &&
    (crypto.name.toLowerCase().includes(searchQuery) ||
      crypto.symbol.toLowerCase().includes(searchQuery))
  );

  const emptyMessage = searchQuery
    ? `No cryptocurrencies found matching "${searchQuery}"`
    : showingWatchlist
      ? "Your watchlist is empty. Tap the ☆ on any coin to add it."
      : "No cryptocurrencies to show.";

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <Header showBackButton={false} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="loader" />
            <p className="text-fg-muted mt-4">Loading crypto data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header showBackButton={false} onSearch={handleSearch} />
      <ErrorModal message={error} onClose={() => setError("")} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-bold text-fg">
            {showingWatchlist ? "My Watchlist" : "Cryptocurrencies"}
          </h1>

          {isAuthenticated && (
            <div className="inline-flex rounded-lg border border-line p-1">
              {[
                { label: "All", value: false },
                { label: `Watchlist (${favorites.size})`, value: true },
              ].map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setWatchlistOnly(tab.value)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                    watchlistOnly === tab.value
                      ? "bg-accent text-accent-fg"
                      : "text-fg-muted hover:bg-surface-2"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredCryptos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCryptos.map((crypto) => (
              <CryptoCard key={crypto.id} crypto={crypto} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-fg-muted text-lg">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

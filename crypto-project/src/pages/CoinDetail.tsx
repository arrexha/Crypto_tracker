import { useNavigate, useParams } from "react-router";
import { fetchChartData, fetchCoinData } from "../api/coinGecko";
import { useEffect, useState } from "react";
import { formatMarketCap, formatPrice } from "../utils/formatter";
import { Header, FavoriteButton } from "../components";
import {
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  Tooltip,
} from "recharts";
import { CoinDetailData, ChartDataPoint } from "../types";
import { useTheme, themeColor } from "../context/ThemeContext";

export const CoinDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useTheme(); // re-render the chart with new colors when the theme changes
  const [coin, setCoin] = useState<CoinDetailData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadCoinData();
    loadChartData();
  }, [id]);

  const loadCoinData = async () => {
    if (!id) return;
    try {
      const data = await fetchCoinData(id);
      setCoin(data);
    } catch (err) {
      console.error("Error fetching crypto: ", err);
    }
  };

  const loadChartData = async () => {
    if (!id) return;
    try {
      const data = await fetchChartData(id);

      const formattedData = data.prices.map((price) => ({
        time: new Date(price[0]).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: price[1].toFixed(2),
      }));

      setChartData(formattedData);
    } catch (err) {
      console.error("Error fetching crypto: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg">
        <Header showBackButton={true} />
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="min-h-screen bg-bg">
        <Header showBackButton={true} />
        <div className="min-h-96 flex flex-col items-center justify-center">
          <p className="text-fg-muted text-xl mb-4">Coin not found</p>
          <button onClick={() => navigate("/home")} className="px-6 py-2 bg-accent hover:bg-accent-hover text-accent-fg rounded-lg font-medium transition">Go Back</button>
        </div>
      </div>
    );
  }

  const priceChange = coin.market_data.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;
  return (
    <div className="min-h-screen bg-bg">
      <Header showBackButton={true} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => navigate("/home")} className="mb-6 px-4 py-2 bg-surface-2 hover:bg-line text-fg rounded-lg font-medium transition">← Back to List</button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <img src={coin.image.large} alt={coin.name} className="w-16 h-16 rounded-full border-2 border-line" />
            <div>
              <h1 className="text-3xl font-bold text-fg">{coin.name}</h1>
              <p className="text-fg-muted font-semibold uppercase">{coin.symbol.toUpperCase()}</p>
            </div>
            <FavoriteButton cryptoId={coin.id} />
          </div>

        </div>

        <div className="bg-surface border border-line rounded-xl p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-fg mb-3">{formatPrice(coin.market_data.current_price.usd)}</h2>
            <span className={`inline-block px-4 py-2 rounded-lg font-semibold ${isPositive ? 'bg-up/15 text-up' : 'bg-down/15 text-down'}`}>
               {isPositive ? "↑" : "↓"} {Math.abs(priceChange).toFixed(2)}%
               
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div>
              <span className="text-fg-muted text-sm font-semibold uppercase">24h High</span>
              <p className="text-xl text-fg font-bold">{formatPrice(coin.market_data.high_24h.usd)}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-line rounded-xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-fg mb-6">Price Chart (7 Days)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={themeColor("line", 0.6)} />
              <XAxis dataKey="time" stroke={themeColor("fg-muted")} style={{ fontSize: "12px" }} />
              <YAxis stroke={themeColor("fg-muted")} style={{ fontSize: "12px" }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: themeColor("surface", 0.95),
                  border: `1px solid ${themeColor("line")}`,
                  borderRadius: "8px",
                  color: themeColor("fg"),
                }}
              />
              <Line type="monotone" dataKey="price" stroke={themeColor("accent")} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-line rounded-lg p-4">
            <span className="text-fg-muted text-xs font-semibold uppercase">Market Cap</span>
            <p className="text-sm text-fg font-bold mt-1">${formatMarketCap(coin.market_data.market_cap.usd)}</p>
          </div>

          <div className="bg-surface border border-line rounded-lg p-4">
            <span className="text-fg-muted text-xs font-semibold uppercase">Total Supply</span>
            <p className="text-sm text-fg font-bold mt-1">{coin.market_data.total_supply?.toLocaleString() || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

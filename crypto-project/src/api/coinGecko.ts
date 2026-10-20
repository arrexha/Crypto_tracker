import { CryptoData, CoinDetailData, ChartApiResponse } from "../types";

const BASE_URL = "https://api.coingecko.com/api/v3";
const CACHE_TTL_MS = 60_000;

// CoinGecko's free tier rate-limits quickly, and its 429 responses have no CORS headers,
// so the browser reports them as a generic "Failed to fetch". Cache responses briefly and
// translate network failures into a message that says what actually happened.
const cache = new Map<string, { time: number; data: unknown }>();

const fetchJson = async <T>(path: string, errorMessage: string): Promise<T> => {
  const cached = cache.get(path);
  if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
    return cached.data as T;
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`);
  } catch {
    throw new Error(
      "Couldn't reach CoinGecko. You may be rate-limited; wait a minute and refresh."
    );
  }

  if (response.status === 429) {
    throw new Error("CoinGecko rate limit reached. Wait a minute and refresh.");
  }
  if (!response.ok) {
    throw new Error(errorMessage);
  }

  const data = await response.json();
  cache.set(path, { time: Date.now(), data });
  return data;
};

export const fetchCryptos = (): Promise<CryptoData[]> =>
  fetchJson(
    "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
    "Failed to fetch cryptos"
  );

export const fetchCoinData = (id: string): Promise<CoinDetailData> =>
  fetchJson(
    `/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
    "Failed to fetch coin data"
  );

export const fetchChartData = (id: string): Promise<ChartApiResponse> =>
  fetchJson(`/coins/${id}/market_chart?vs_currency=usd&days=7`, "Failed to fetch chart data");

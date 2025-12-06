import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  },
  timeout: 30000, // 30 seconds timeout
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface StockData {
  symbol: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketTime?: number;
  longName?: string;
  shortName?: string;
  [key: string]: any;
}

export interface TrendingStocksResponse {
  quotes: Array<{
    symbol: string;
    [key: string]: any;
  }>;
}

export interface UsStocksResponse {
  sector: string;
  data: StockData[];
}


export const getStockData = async (symbol: string | string[]): Promise<StockData[]> => {
  try {
    // Convert array to comma-separated string if needed
    let symbolParam: string;
    if (Array.isArray(symbol)) {
      // Trim spaces from each symbol and join with commas
      symbolParam = symbol.map(s => s.trim()).join(',');
    } else {
      // If string, split by comma, trim each, and rejoin (handles spaces)
      symbolParam = symbol.split(',').map(s => s.trim()).join(',');
    }

    const response = await apiClient.get<StockData[]>(`/stockFetcher/${symbolParam}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

/**
 * Fetch trending stocks for a specific market/region
 * @param market - Market code (e.g., 'IN', 'US', 'GB')
 * @returns Promise<string[]> - Array of trending stock symbols
 */
export const getTrendingStocks = async (market: string = 'IN'): Promise<string[]> => {
  try {
    const response = await apiClient.get<string[]>(`/stockFetcher/trending/${market}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending stocks:', error);
    throw error;
  }
};

/**
 * Fetch US stocks data grouped by sector
 * @returns Promise<UsStocksResponse[]> - Array of sectors with their stock data
 */
export const getUsStocks = async (): Promise<UsStocksResponse[]> => {
  try {
    const response = await apiClient.get<UsStocksResponse[]>('/stockFetcher/usStocks');
    return response.data;
  } catch (error) {
    console.error('Error fetching US stocks:', error);
    throw error;
  }
};

// Export the axios instance for custom requests if needed
export default apiClient;


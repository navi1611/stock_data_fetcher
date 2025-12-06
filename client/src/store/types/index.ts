import { StockData, UsStocksResponse } from '@/services/stockApi';

export interface StockState {
  stocks: StockData[];
  usStocks: UsStocksResponse[];
  trendingStocks: string[];
  loading: boolean;
  error: string | null;
  selectedSymbols: string[];
}


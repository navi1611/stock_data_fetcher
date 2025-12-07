import { StockData, UsStocksResponse, HoldingsResponse, HoldingsBySectorResponse } from '@/interface';

export interface StockState {
  stocks: StockData[];
  usStocks: UsStocksResponse[];
  trendingStocks: string[];
  holdings: HoldingsResponse[];
  holdingsBySector: HoldingsBySectorResponse[];
  loading: boolean;
  error: string | null;
  selectedSymbols: string[];
}


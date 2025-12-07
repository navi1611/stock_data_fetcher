import { UsStocksResponse, HoldingsBySectorResponse } from '@/interface';

export interface StockState {
  usStocks: UsStocksResponse[];
  holdingsBySector: HoldingsBySectorResponse[];
  loading: boolean;
}


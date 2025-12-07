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

export interface UsStocksResponse {
  sector: string;
  data: StockData[];
}

export interface HoldingsResponse {
  particulars: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  portfolioPercent: number;
  exchange: string;
  symbol: string;
  cmp: number;
  presentValue: number;
  gainLoss: number;
  peRatio: number | null;
}

export interface HoldingsBySectorResponse {
  sector: string;
  holdings: HoldingsResponse[];
}

import { HoldingsRequest, HoldingsResponse, HoldingsBySectorResponse, StockData, UsStocksResponse } from '@/interface';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const baseApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  },
  timeout: 30000,
});

baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);


export const getStockData = async (symbol: string | string[]): Promise<StockData[]> => {
  try {
    let symbolParam: string;
    if (Array.isArray(symbol)) {
      symbolParam = symbol.map(s => s.trim()).join(',');
    } else {
      symbolParam = symbol.split(',').map(s => s.trim()).join(',');
    }

    const response = await baseApi.get<StockData[]>(`/stockFetcher/${symbolParam}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

export const getTrendingStocks = async (market: string = 'IN'): Promise<string[]> => {
  try {
    const response = await baseApi.get<string[]>(`/stockFetcher/trending/${market}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending stocks:', error);
    throw error;
  }
};

export const getUsStocks = async (): Promise<UsStocksResponse[]> => {
  try {
    const response = await baseApi.get<UsStocksResponse[]>('/stockFetcher/usStocks');
    return response.data;
  } catch (error) {
    console.error('Error fetching US stocks:', error);
    throw error;
  }
};

export const getHoldingsData = async (holdings: HoldingsRequest): Promise<HoldingsResponse[]> => {
  try {
    const response = await baseApi.post<HoldingsResponse[]>('/stockFetcher/holdings', holdings);
    return response.data;
  } catch (error) {
    console.error('Error fetching holdings data:', error);
    throw error;
  }
};

export const getHoldingsBySector = async (): Promise<HoldingsBySectorResponse[]> => {
  try {
    const response = await baseApi.get<HoldingsBySectorResponse[]>('/stockFetcher/holdings-by-sector');
    return response.data;
  } catch (error) {
    console.error('Error fetching holdings by sector:', error);
    throw error;
  }
};

export default baseApi;


import { createAsyncThunk } from '@reduxjs/toolkit';
import { getStockData, getTrendingStocks, getUsStocks, StockData, UsStocksResponse } from '@/services/stockApi';

export const fetchStockData = createAsyncThunk(
  'stock/fetchStockData',
  async (symbols: string | string[], { rejectWithValue }) => {
    try {
      const data = await getStockData(symbols);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch stock data');
    }
  }
);

export const fetchTrendingStocks = createAsyncThunk(
  'stock/fetchTrendingStocks',
  async (market: string = 'IN', { rejectWithValue }) => {
    try {
      const data = await getTrendingStocks(market);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch trending stocks');
    }
  }
);

export const fetchUsStocks = createAsyncThunk(
  'stock/fetchUsStocks',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUsStocks();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch US stocks');
    }
  }
);

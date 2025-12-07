import { createAsyncThunk } from '@reduxjs/toolkit';
import { getStockData, getTrendingStocks, getUsStocks, getHoldingsData, getHoldingsBySector } from '@/services/stockService';
import { StockData, UsStocksResponse, HoldingsRequest, HoldingsResponse, HoldingsBySectorResponse } from '@/interface';

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

export const fetchHoldings = createAsyncThunk(
  'stock/fetchHoldings',
  async (holdings: HoldingsRequest, { rejectWithValue }) => {
    try {
      const data = await getHoldingsData(holdings);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch holdings data');
    }
  }
);

export const fetchHoldingsBySector = createAsyncThunk(
  'stock/fetchHoldingsBySector',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getHoldingsBySector();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch holdings by sector');
    }
  }
);

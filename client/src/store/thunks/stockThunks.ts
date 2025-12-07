import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUsStocks, getHoldingsBySector } from '@/services/stockService';

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

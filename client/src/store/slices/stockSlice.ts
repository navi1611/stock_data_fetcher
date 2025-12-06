import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StockState } from '../types';
import { fetchStockData, fetchTrendingStocks, fetchUsStocks } from '../thunks/stockThunks';

const initialState: StockState = {
  stocks: [],
  usStocks: [],
  trendingStocks: [],
  loading: false,
  error: null,
  selectedSymbols: [],
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setSelectedSymbols: (state, action: PayloadAction<string[]>) => {
      state.selectedSymbols = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearStocks: (state) => {
      state.stocks = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch stock data
    builder
      .addCase(fetchStockData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
        state.error = null;
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stock data';
      });

    // Fetch trending stocks
    builder
      .addCase(fetchTrendingStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingStocks = action.payload;
        state.error = null;
      })
      .addCase(fetchTrendingStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trending stocks';
      });

    // Fetch US stocks
    builder
      .addCase(fetchUsStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.usStocks = action.payload;
        state.error = null;
      })
      .addCase(fetchUsStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch US stocks';
      });
  },
});

export const { setSelectedSymbols, clearError, clearStocks } = stockSlice.actions;
export default stockSlice.reducer;

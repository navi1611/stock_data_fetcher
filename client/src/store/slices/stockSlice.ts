import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StockState } from '../types';
import { fetchStockData, fetchTrendingStocks, fetchUsStocks, fetchHoldings, fetchHoldingsBySector } from '../thunks/stockThunks';

const initialState: StockState = {
  stocks: [],
  usStocks: [],
  trendingStocks: [],
  holdings: [],
  holdingsBySector: [],
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

    builder
      .addCase(fetchHoldings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHoldings.fulfilled, (state, action) => {
        state.loading = false;
        state.holdings = action.payload;
        state.error = null;
      })
      .addCase(fetchHoldings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch holdings data';
      });

    builder
      .addCase(fetchHoldingsBySector.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHoldingsBySector.fulfilled, (state, action) => {
        state.loading = false;
        state.holdingsBySector = action.payload;
        state.error = null;
      })
      .addCase(fetchHoldingsBySector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch holdings for sector';
      });
  },
});

export const { setSelectedSymbols, clearError, clearStocks } = stockSlice.actions;
export default stockSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { StockState } from '../types';
import { fetchUsStocks, fetchHoldingsBySector } from '../thunks/stockThunks';

const initialState: StockState = {
  usStocks: [],
  holdingsBySector: [],
  loading: false,
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsStocks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.usStocks = action.payload;
      })
      .addCase(fetchUsStocks.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(fetchHoldingsBySector.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHoldingsBySector.fulfilled, (state, action) => {
        state.loading = false;
        state.holdingsBySector = action.payload;
      })
      .addCase(fetchHoldingsBySector.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default stockSlice.reducer;

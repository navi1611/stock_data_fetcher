import { configureStore } from '@reduxjs/toolkit';
import stockReducer from './slices/stockSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      stock: stockReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['stock/fetchStockData/fulfilled', 'stock/fetchUsStocks/fulfilled'],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

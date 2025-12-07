import { StockData, UsStocksResponse } from '@/services/stockService';

export const FETCH_US_STOCKS_REQUEST = 'FETCH_US_STOCKS_REQUEST';
export const FETCH_US_STOCKS_SUCCESS = 'FETCH_US_STOCKS_SUCCESS';
export const FETCH_US_STOCKS_FAILURE = 'FETCH_US_STOCKS_FAILURE';

export const FETCH_STOCK_DATA_REQUEST = 'FETCH_STOCK_DATA_REQUEST';
export const FETCH_STOCK_DATA_SUCCESS = 'FETCH_STOCK_DATA_SUCCESS';
export const FETCH_STOCK_DATA_FAILURE = 'FETCH_STOCK_DATA_FAILURE';

export const FETCH_TRENDING_STOCKS_REQUEST = 'FETCH_TRENDING_STOCKS_REQUEST';
export const FETCH_TRENDING_STOCKS_SUCCESS = 'FETCH_TRENDING_STOCKS_SUCCESS';
export const FETCH_TRENDING_STOCKS_FAILURE = 'FETCH_TRENDING_STOCKS_FAILURE';

export const CLEAR_ERROR = 'CLEAR_ERROR';

interface FetchUsStocksRequestAction {
  type: typeof FETCH_US_STOCKS_REQUEST;
}

interface FetchUsStocksSuccessAction {
  type: typeof FETCH_US_STOCKS_SUCCESS;
  payload: UsStocksResponse[];
}

interface FetchUsStocksFailureAction {
  type: typeof FETCH_US_STOCKS_FAILURE;
  payload: string;
}

interface FetchStockDataRequestAction {
  type: typeof FETCH_STOCK_DATA_REQUEST;
}

interface FetchStockDataSuccessAction {
  type: typeof FETCH_STOCK_DATA_SUCCESS;
  payload: StockData[];
}

interface FetchStockDataFailureAction {
  type: typeof FETCH_STOCK_DATA_FAILURE;
  payload: string;
}

interface FetchTrendingStocksRequestAction {
  type: typeof FETCH_TRENDING_STOCKS_REQUEST;
}

interface FetchTrendingStocksSuccessAction {
  type: typeof FETCH_TRENDING_STOCKS_SUCCESS;
  payload: string[];
}

interface FetchTrendingStocksFailureAction {
  type: typeof FETCH_TRENDING_STOCKS_FAILURE;
  payload: string;
}

interface ClearErrorAction {
  type: typeof CLEAR_ERROR;
}

export type StockActionTypes =
  | FetchUsStocksRequestAction
  | FetchUsStocksSuccessAction
  | FetchUsStocksFailureAction
  | FetchStockDataRequestAction
  | FetchStockDataSuccessAction
  | FetchStockDataFailureAction
  | FetchTrendingStocksRequestAction
  | FetchTrendingStocksSuccessAction
  | FetchTrendingStocksFailureAction
  | ClearErrorAction;


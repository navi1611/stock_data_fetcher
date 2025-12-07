import { getRequest } from '@/helper/axios';
import { HoldingsBySectorResponse, UsStocksResponse } from '@/interface';


export const getUsStocks = async (): Promise<UsStocksResponse[]> => {
  try {
    const response = await getRequest<UsStocksResponse[]>('/stockFetcher/usStocks');
    return response.data;
  } catch (error) {
    console.error('Error fetching US stocks:', error);
    throw error;
  }
};

export const getHoldingsBySector = async (): Promise<HoldingsBySectorResponse[]> => {
  try {
    const response = await getRequest<HoldingsBySectorResponse[]>('/stockFetcher/holdings-by-sector');
    return response.data;
  } catch (error) {
    console.error('Error fetching holdings by sector:', error);
    throw error;
  }
};


import { BadRequestException, Injectable } from '@nestjs/common';
import YahooFinance from 'yahoo-finance2/src/index.ts';
import { US_STOCKS } from './constant';

@Injectable()
export class StockService {
  private readonly yahooFinance = new YahooFinance();

  getHello(): string {
    return 'Hello World!';
  }


  async getStockData(key: string | string[]) {
    try {
      const arrayKey = Array.isArray(key) ? key : [key];

      // Replace dots for Yahoo Finance (e.g., BRK.B → BRK-B)
      const formattedKeys = arrayKey.map((k) => k.replace('.', '-'));

      const data = await this.yahooFinance.quote(formattedKeys);

      // Normalize response to always return an array
      if (Array.isArray(data)) {
        return data; // already an array (single symbol or multiple quotes)
      } else {
        return Object.values(data); // convert {AAPL: {...}, MSFT: {...}} → [{...}, {...}]
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw new BadRequestException('Unable to fetch stock data');
    }
  }

  async getRegionBasedTrending(market: string = 'IN') {
    try {
      const data = await this.yahooFinance.trendingSymbols(market);
      const symbols = data.quotes.map((item) => item.symbol);
      // const symbolData = await this.getStockData(symbols);
      return symbols;
    } catch (error) {
      console.error('Error fetching trending stocks:', error);
      throw new BadRequestException('Unable to fetch trending stocks');
    }
  }

  async getUsStocks() {
    try {
      const res = await Promise.all(
        US_STOCKS.map(async (item) => {
          const data = await this.getStockData(item.symbol);

          return {
            sector: item.sector,
            data, // data for this sector
          };
        }),
      );
      return res;
    } catch (error) {
      throw new BadRequestException('Unable to fetch trending stocks');
    }
  }
}

import { StockService } from './stockfetcher.service';
export declare class StockFetchController {
    private readonly stockService;
    constructor(stockService: StockService);
    getStockData(symbol: string): Promise<unknown[] | {
        message: string;
    }>;
    getRegionBasedTrending(market: string): Promise<string[]>;
    getUsStocks(): Promise<{
        sector: string;
        data: unknown[];
    }[]>;
}

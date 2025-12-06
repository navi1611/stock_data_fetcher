export declare class StockService {
    private readonly yahooFinance;
    getHello(): string;
    getStockData(key: string | string[]): Promise<unknown[]>;
    getRegionBasedTrending(market?: string): Promise<string[]>;
    getUsStocks(): Promise<{
        sector: string;
        data: unknown[];
    }[]>;
}

import { HoldingsDto } from "./dto/holding.dto";
export declare class StockService {
    private readonly logger;
    private readonly yahooFinance;
    getStockData(key: string | string[]): Promise<unknown[]>;
    getUsStocks(): Promise<{
        sector: string;
        data: unknown[];
    }[]>;
    getHoldingsData(holdings: HoldingsDto): Promise<{
        particulars: string;
        purchasePrice: number;
        quantity: number;
        investment: number;
        portfolioPercent: number;
        exchange: any;
        symbol: string;
        cmp: any;
        presentValue: number;
        gainLoss: number;
        peRatio: any;
    }[]>;
    private getDataFilePath;
    getHoldingsBySector(): Promise<any[]>;
}

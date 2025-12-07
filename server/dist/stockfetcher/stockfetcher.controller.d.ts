import { StockService } from "./stockfetcher.service";
import { SymbolDto } from "./dto/symbol.dto";
import { HoldingsDto } from "./dto/holding.dto";
export declare class StockFetchController {
    private readonly stockService;
    constructor(stockService: StockService);
    getStockData(body: SymbolDto): Promise<unknown[] | {
        message: string;
    }>;
    getRegionBasedTrending(market: string): Promise<unknown[]>;
    getUsStocks(): Promise<{
        sector: string;
        data: unknown[];
    }[]>;
    getHoldingsData(body: HoldingsDto): Promise<{
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
    }[] | {
        message: string;
    }>;
    getHoldingsBySector(): Promise<any[] | {
        message: string;
    }>;
}

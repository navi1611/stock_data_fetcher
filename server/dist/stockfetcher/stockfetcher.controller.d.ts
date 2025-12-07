import { StockService } from "./stockfetcher.service";
export declare class StockFetchController {
    private readonly stockService;
    constructor(stockService: StockService);
    getUsStocks(): Promise<{
        sector: string;
        data: unknown[];
    }[]>;
    getHoldingsBySector(): Promise<any[] | {
        message: string;
    }>;
}

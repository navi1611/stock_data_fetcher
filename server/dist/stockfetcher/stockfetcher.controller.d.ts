import { StockService } from "./stockfetcher.service";
import { SymbolDto } from "./dto/symbol.dto";
export declare class StockFetchController {
    private readonly stockService;
    constructor(stockService: StockService);
    getStockData(body: SymbolDto): Promise<unknown[] | {
        message: string;
    }>;
    getRegionBasedTrending(market: string): Promise<string[]>;
    getUsStocks(): Promise<{
        sector: string;
        data: unknown[];
    }[]>;
}

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var StockService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const index_ts_1 = __importDefault(require("yahoo-finance2/src/index.ts"));
const constant_1 = require("./constant");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let StockService = StockService_1 = class StockService {
    logger = new common_1.Logger(StockService_1.name);
    yahooFinance = new index_ts_1.default();
    async getStockData(key) {
        try {
            const arrayKey = Array.isArray(key) ? key : [key];
            const formattedKeys = arrayKey.map((k) => k.replace(".", "-"));
            const data = await this.yahooFinance.quote(formattedKeys);
            const dataArray = Array.isArray(data) ? data : Object.values(data);
            return dataArray.map((item) => item);
        }
        catch (error) {
            this.logger.error(`Error fetching stock data: ${error.message}`, error.stack);
            throw new common_1.BadRequestException("Unable to fetch stock data");
        }
    }
    async getRegionBasedTrending(market = "IN") {
        try {
            const data = await this.yahooFinance.trendingSymbols(market);
            const symbols = data.quotes.map((item) => item.symbol);
            const symbolData = await this.getStockData(symbols);
            return symbolData;
        }
        catch (error) {
            this.logger.error(`Error fetching trending stocks for market ${market}: ${error.message}`, error.stack);
            throw new common_1.BadRequestException("Unable to fetch trending stocks");
        }
    }
    async getUsStocks() {
        try {
            const res = await Promise.all(constant_1.US_STOCKS.map(async (item) => {
                const data = await this.getStockData(item.symbol);
                return {
                    sector: item.sector,
                    data,
                };
            }));
            return res;
        }
        catch {
            throw new common_1.BadRequestException("Unable to fetch trending stocks");
        }
    }
    async getHoldingsData(holdings) {
        try {
            const symbols = holdings.holdings.map((h) => h.symbol);
            const formattedKeys = symbols.map((k) => k.replace(".", "-"));
            const stockData = await this.yahooFinance.quote(formattedKeys);
            const dataArray = Array.isArray(stockData)
                ? stockData
                : Object.values(stockData);
            const stockDataMap = new Map(dataArray.map((item) => {
                const symbol = item.symbol ? item.symbol.replace("-", ".") : "";
                return [symbol, item];
            }));
            const totalInvestment = holdings.holdings.reduce((sum, holding) => sum + holding.purchasePrice * holding.quantity, 0);
            const holdingsWithData = holdings.holdings.map((holding) => {
                const stockInfo = stockDataMap.get(holding.symbol);
                const cmp = stockInfo?.regularMarketPrice || 0;
                const investment = holding.purchasePrice * holding.quantity;
                const presentValue = cmp * holding.quantity;
                const gainLoss = presentValue - investment;
                const portfolioPercent = totalInvestment > 0 ? (investment / totalInvestment) * 100 : 0;
                const peRatio = stockInfo?.trailingPE || stockInfo?.forwardPE || null;
                return {
                    particulars: holding.particulars,
                    purchasePrice: holding.purchasePrice,
                    quantity: holding.quantity,
                    investment: investment,
                    portfolioPercent: portfolioPercent,
                    exchange: stockInfo?.exchange || "",
                    symbol: holding.symbol,
                    cmp: cmp,
                    presentValue: presentValue,
                    gainLoss: gainLoss,
                    peRatio: peRatio,
                };
            });
            return holdingsWithData;
        }
        catch (error) {
            this.logger.error(`Error fetching holdings data: ${error.message}`, error.stack);
            throw new common_1.BadRequestException("Unable to fetch holdings data");
        }
    }
    getDataFilePath() {
        const searchPaths = [
            path.resolve("src/stockfetcher/data.json"),
            path.resolve("server/src/stockfetcher/data.json"),
        ];
        for (const filePath of searchPaths) {
            if (fs.existsSync(filePath)) {
                return filePath;
            }
        }
        throw new Error("data.json not found in expected locations");
    }
    async getHoldingsBySector() {
        try {
            const dataFilePath = this.getDataFilePath();
            const raw = fs.readFileSync(dataFilePath, "utf8");
            const data = JSON.parse(raw);
            const holdingsBySector = await Promise.all(data.US_STOCKS.map(async (sector) => {
                if (!sector.holdings || sector.holdings.length === 0) {
                    return {
                        sector: sector.sector,
                        holdings: [],
                    };
                }
                const enrichedHoldings = await this.getHoldingsData({
                    holdings: sector.holdings,
                });
                return {
                    sector: sector.sector,
                    holdings: enrichedHoldings,
                };
            }));
            return holdingsBySector;
        }
        catch (error) {
            this.logger.error(`Error fetching holdings by sector: ${error.message}`, error.stack);
            throw new common_1.BadRequestException("Unable to fetch holdings by sector");
        }
    }
    async updateStockPrices() {
        try {
            const dataFilePath = this.getDataFilePath();
            const raw = fs.readFileSync(dataFilePath, "utf8");
            const data = JSON.parse(raw);
            for (const sector of data.US_STOCKS) {
                for (const holding of sector.holdings) {
                    try {
                        await this.getHoldingsData({ holdings: [holding] });
                    }
                    catch (err) {
                        this.logger.warn(`Failed price fetch for ${holding.symbol}: ${err.message}`);
                    }
                }
            }
            fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
            this.logger.log("Stock prices updated successfully");
        }
        catch (error) {
            this.logger.error(`Error reading/writing data.json: ${error.message}`, error.stack);
        }
    }
};
exports.StockService = StockService;
exports.StockService = StockService = StockService_1 = __decorate([
    (0, common_1.Injectable)()
], StockService);
//# sourceMappingURL=stockfetcher.service.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const index_ts_1 = __importDefault(require("yahoo-finance2/src/index.ts"));
const constant_1 = require("./constant");
let StockService = class StockService {
    yahooFinance = new index_ts_1.default();
    getHello() {
        return "Hello World!";
    }
    async getStockData(key) {
        try {
            const arrayKey = Array.isArray(key) ? key : [key];
            const formattedKeys = arrayKey.map((k) => k.replace(".", "-"));
            const data = await this.yahooFinance.quote(formattedKeys);
            const dataArray = Array.isArray(data) ? data : Object.values(data);
            return dataArray.map((item) => item);
        }
        catch (error) {
            console.error("Error fetching stock data:", error);
            throw new common_1.BadRequestException("Unable to fetch stock data");
        }
    }
    async getRegionBasedTrending(market = "IN") {
        try {
            const data = await this.yahooFinance.trendingSymbols(market);
            const symbols = data.quotes.map((item) => item.symbol);
            return symbols;
        }
        catch (error) {
            console.error("Error fetching trending stocks:", error);
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
        catch (error) {
            throw new common_1.BadRequestException("Unable to fetch trending stocks");
        }
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)()
], StockService);
//# sourceMappingURL=stockfetcher.service.js.map
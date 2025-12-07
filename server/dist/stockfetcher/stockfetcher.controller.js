"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockFetchController = void 0;
const common_1 = require("@nestjs/common");
const stockfetcher_service_1 = require("./stockfetcher.service");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const symbol_dto_1 = require("./dto/symbol.dto");
const holding_dto_1 = require("./dto/holding.dto");
let StockFetchController = class StockFetchController {
    stockService;
    constructor(stockService) {
        this.stockService = stockService;
    }
    async getStockData(body) {
        try {
            const stockData = await this.stockService.getStockData(body.symbol);
            return stockData;
        }
        catch {
            return { message: "Error fetching stock data" };
        }
    }
    async getRegionBasedTrending(market) {
        return this.stockService.getRegionBasedTrending(market);
    }
    async getUsStocks() {
        return await this.stockService.getUsStocks();
    }
    async getHoldingsData(body) {
        try {
            const holdingsData = await this.stockService.getHoldingsData(body);
            return holdingsData;
        }
        catch {
            return { message: "Error fetching holdings data" };
        }
    }
    async getHoldingsBySector() {
        try {
            const holdingsBySector = await this.stockService.getHoldingsBySector();
            return holdingsBySector;
        }
        catch {
            return { message: "Error fetching holdings by sector" };
        }
    }
};
exports.StockFetchController = StockFetchController;
__decorate([
    (0, common_1.Post)("symbol"),
    (0, common_1.Header)("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"),
    (0, common_1.Header)("Pragma", "no-cache"),
    (0, common_1.Header)("Expires", "0"),
    (0, swagger_1.ApiOperation)({ summary: "To Fetch Stock Data" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Stock Data" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [symbol_dto_1.SymbolDto]),
    __metadata("design:returntype", Promise)
], StockFetchController.prototype, "getStockData", null);
__decorate([
    (0, common_1.Get)("trending/:market"),
    (0, common_1.Header)("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"),
    (0, common_1.Header)("Pragma", "no-cache"),
    (0, common_1.Header)("Expires", "0"),
    (0, swagger_1.ApiOperation)({ summary: "To Fetch Stock Data On Region" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Stock Data On Region" }),
    __param(0, (0, common_1.Param)("market")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockFetchController.prototype, "getRegionBasedTrending", null);
__decorate([
    (0, common_1.Get)("usStocks"),
    (0, common_1.Header)("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"),
    (0, common_1.Header)("Pragma", "no-cache"),
    (0, common_1.Header)("Expires", "0"),
    (0, swagger_1.ApiOperation)({ summary: "To Fetch US Stock Data" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "US Stock Data" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StockFetchController.prototype, "getUsStocks", null);
__decorate([
    (0, common_1.Post)("holdings"),
    (0, common_1.Header)("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"),
    (0, common_1.Header)("Pragma", "no-cache"),
    (0, common_1.Header)("Expires", "0"),
    (0, swagger_1.ApiOperation)({
        summary: "To Fetch Holdings Data with CMP, P/E Ratio, and Earnings",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Holdings Data" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [holding_dto_1.HoldingsDto]),
    __metadata("design:returntype", Promise)
], StockFetchController.prototype, "getHoldingsData", null);
__decorate([
    (0, common_1.Get)("holdings-by-sector"),
    (0, common_1.Header)("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"),
    (0, common_1.Header)("Pragma", "no-cache"),
    (0, common_1.Header)("Expires", "0"),
    (0, swagger_1.ApiOperation)({
        summary: "To Fetch Holdings Data by Sector from data.json",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Holdings Data by Sector" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StockFetchController.prototype, "getHoldingsBySector", null);
exports.StockFetchController = StockFetchController = __decorate([
    (0, swagger_1.ApiTags)("stockFetcher"),
    (0, common_1.Controller)("stockFetcher"),
    (0, throttler_1.Throttle)({
        "/stockFetcher/:symbol": {
            limit: 1000,
            ttl: 86400,
        },
    }),
    __metadata("design:paramtypes", [stockfetcher_service_1.StockService])
], StockFetchController);
//# sourceMappingURL=stockfetcher.controller.js.map
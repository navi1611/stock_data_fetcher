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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockFetchController = void 0;
const common_1 = require("@nestjs/common");
const stockfetcher_service_1 = require("./stockfetcher.service");
const swagger_1 = require("@nestjs/swagger");
let StockFetchController = class StockFetchController {
    stockService;
    constructor(stockService) {
        this.stockService = stockService;
    }
    async getUsStocks() {
        return await this.stockService.getUsStocks();
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
    __metadata("design:paramtypes", [stockfetcher_service_1.StockService])
], StockFetchController);
//# sourceMappingURL=stockfetcher.controller.js.map
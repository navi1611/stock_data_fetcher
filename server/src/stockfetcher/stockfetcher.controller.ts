import { Controller, Get, Param, Header, Post, Body } from "@nestjs/common";
import { StockService } from "./stockfetcher.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { SymbolDto } from "./dto/symbol.dto";
import { HoldingsDto } from "./dto/holding.dto";

@ApiTags("stockFetcher")
@Controller("stockFetcher")
@Throttle({
  "/stockFetcher/:symbol": {
    limit: 1000,
    ttl: 86400,
  },
})
export class StockFetchController {
  constructor(private readonly stockService: StockService) {}

  @Post("symbol")
  @Header(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  )
  @Header("Pragma", "no-cache")
  @Header("Expires", "0")
  @ApiOperation({ summary: "To Fetch Stock Data" })
  @ApiResponse({ status: 200, description: "Stock Data" })
  async getStockData(@Body() body: SymbolDto) {
    try {
      const stockData = await this.stockService.getStockData(body.symbol);
      return stockData;
    } catch {
      return { message: "Error fetching stock data" };
    }
  }

  @Get("trending/:market")
  @Header(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  )
  @Header("Pragma", "no-cache")
  @Header("Expires", "0")
  @ApiOperation({ summary: "To Fetch Stock Data On Region" })
  @ApiResponse({ status: 200, description: "Stock Data On Region" })
  async getRegionBasedTrending(@Param("market") market: string) {
    return this.stockService.getRegionBasedTrending(market);
  }

  @Get("usStocks")
  @Header(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  )
  @Header("Pragma", "no-cache")
  @Header("Expires", "0")
  @ApiOperation({ summary: "To Fetch US Stock Data" })
  @ApiResponse({ status: 200, description: "US Stock Data" })
  async getUsStocks() {
    return await this.stockService.getUsStocks();
  }

  @Post("holdings")
  @Header(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  )
  @Header("Pragma", "no-cache")
  @Header("Expires", "0")
  @ApiOperation({
    summary: "To Fetch Holdings Data with CMP, P/E Ratio, and Earnings",
  })
  @ApiResponse({ status: 200, description: "Holdings Data" })
  async getHoldingsData(@Body() body: HoldingsDto) {
    try {
      const holdingsData = await this.stockService.getHoldingsData(body);
      return holdingsData;
    } catch {
      return { message: "Error fetching holdings data" };
    }
  }

  @Get("holdings-by-sector")
  @Header(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  )
  @Header("Pragma", "no-cache")
  @Header("Expires", "0")
  @ApiOperation({
    summary: "To Fetch Holdings Data by Sector from data.json",
  })
  @ApiResponse({ status: 200, description: "Holdings Data by Sector" })
  async getHoldingsBySector() {
    try {
      const holdingsBySector = await this.stockService.getHoldingsBySector();
      return holdingsBySector;
    } catch {
      return { message: "Error fetching holdings by sector" };
    }
  }
}

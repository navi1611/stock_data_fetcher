import {
  Controller,
  Get,
  Param,
  Header,
  Post,
  Body,
} from "@nestjs/common";
import { StockService } from "./stockfetcher.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { SymbolDto } from "./dto/symbol.dto";

@ApiTags("stockFetcher")
@Controller("stockFetcher")
@Throttle({
  "/stockFetcher/:symbol": {
    // This is the key representing the endpoint
    limit: 1000, // 10 requests
    ttl: 86400, // within 60 seconds
  },
})
export class StockFetchController {
  constructor(private readonly stockService: StockService) {}

  @Post("symbol")
  @Header(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  )
  @Header("Pragma", "no-cache")
  @Header("Expires", "0")
  @ApiOperation({ summary: "To Fetch Stock Data" })
  @ApiResponse({ status: 200, description: "Stock Data" })
  async getStockData(@Body() body: SymbolDto) {
    try {
      const stockData = await this.stockService.getStockData(body.symbol);
      return stockData;
    } catch (error) {
      return { message: "Error fetching stock data" };
    }
  }

  @Get("trending/:market")
  @Header(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
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
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  )
  @Header("Pragma", "no-cache")
  @Header("Expires", "0")
  @ApiOperation({ summary: "To Fetch US Stock Data" })
  @ApiResponse({ status: 200, description: "US Stock Data" })
  async getUsStocks() {
    return await this.stockService.getUsStocks();
  }
}

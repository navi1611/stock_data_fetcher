import { Controller, Get, Header } from "@nestjs/common";
import { StockService } from "./stockfetcher.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("stockFetcher")
@Controller("stockFetcher")
export class StockFetchController {
  constructor(private readonly stockService: StockService) {}

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

import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import YahooFinance from "yahoo-finance2/src/index.ts";
import { US_STOCKS } from "./constant";
import { HoldingsDto } from "./dto/holding.dto";
import * as fs from "fs";
import * as path from "path";

interface Stock {
  symbol?: string;
  [key: string]: any;
}

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);
  private readonly yahooFinance = new YahooFinance();

  async getStockData(key: string | string[]) {
    try {
      const arrayKey = Array.isArray(key) ? key : [key];

      const formattedKeys = arrayKey.map((k) => k.replace(".", "-"));

      const data = await this.yahooFinance.quote(formattedKeys);

      const dataArray = Array.isArray(data) ? data : Object.values(data);

      return dataArray.map((item) => item);
    } catch (error) {
      this.logger.error(
        `Error fetching stock data: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException("Unable to fetch stock data");
    }
  }

  async getRegionBasedTrending(market: string = "IN") {
    try {
      const data = await this.yahooFinance.trendingSymbols(market);
      const symbols = data.quotes.map((item) => item.symbol);
      const symbolData = await this.getStockData(symbols);
      return symbolData;
    } catch (error) {
      this.logger.error(
        `Error fetching trending stocks for market ${market}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException("Unable to fetch trending stocks");
    }
  }

  async getUsStocks() {
    try {
      const res = await Promise.all(
        US_STOCKS.map(async (item) => {
          const data = await this.getStockData(item.symbol);

          return {
            sector: item.sector,
            data,
          };
        })
      );
      return res;
    } catch {
      throw new BadRequestException("Unable to fetch trending stocks");
    }
  }

  async getHoldingsData(holdings: HoldingsDto) {
    try {
      const symbols = holdings.holdings.map((h) => h.symbol);

      const formattedKeys = symbols.map((k) => k.replace(".", "-"));

      const stockData = await this.yahooFinance.quote(formattedKeys);

      const dataArray = Array.isArray(stockData)
        ? stockData
        : Object.values(stockData);

      const stockDataMap: Map<string, Stock> = new Map(
        dataArray.map((item: Stock) => {
          const symbol = item.symbol ? item.symbol.replace("-", ".") : "";
          return [symbol, item] as [string, Stock];
        })
      );

      const totalInvestment = holdings.holdings.reduce(
        (sum, holding) => sum + holding.purchasePrice * holding.quantity,
        0
      );

      const holdingsWithData = holdings.holdings.map((holding) => {
        const stockInfo = stockDataMap.get(holding.symbol);
        const cmp = stockInfo?.regularMarketPrice || 0;
        const investment = holding.purchasePrice * holding.quantity;
        const presentValue = cmp * holding.quantity;
        const gainLoss = presentValue - investment;
        const portfolioPercent =
          totalInvestment > 0 ? (investment / totalInvestment) * 100 : 0;

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
    } catch (error) {
      this.logger.error(
        `Error fetching holdings data: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException("Unable to fetch holdings data");
    }
  }

  private getDataFilePath(): string {
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

      const holdingsBySector = await Promise.all(
        data.US_STOCKS.map(async (sector: any) => {
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
        })
      );

      return holdingsBySector;
    } catch (error) {
      this.logger.error(
        `Error fetching holdings by sector: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException("Unable to fetch holdings by sector");
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
          } catch (err) {
            this.logger.warn(
              `Failed price fetch for ${holding.symbol}: ${err.message}`,
            );
          }
        }
      }

      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
      this.logger.log("Stock prices updated successfully");
    } catch (error) {
      this.logger.error(
        `Error reading/writing data.json: ${error.message}`,
        error.stack,
      );
    }
  }
}

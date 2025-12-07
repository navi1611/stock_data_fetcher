import { Module } from "@nestjs/common";
import { StockFetchController } from "./stockfetcher.controller";
import { StockService } from "./stockfetcher.service";

@Module({
  imports: [],
  controllers: [StockFetchController],
  providers: [StockService],
})
export class StockFetchModule {}

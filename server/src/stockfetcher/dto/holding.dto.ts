import { ApiProperty } from "@nestjs/swagger";

export class HoldingDto {
  @ApiProperty({
    description: "Stock name",
    example: "Apple Inc.",
  })
  particulars: string;

  @ApiProperty({
    description: "Purchase price per share",
    example: 150.50,
  })
  purchasePrice: number;

  @ApiProperty({
    description: "Quantity of shares",
    example: 10,
  })
  quantity: number;

  @ApiProperty({
    description: "Stock exchange code (NSE/BSE)",
    example: "NSE",
  })
  exchange: string;

  @ApiProperty({
    description: "Stock symbol",
    example: "AAPL",
  })
  symbol: string;
}

export class HoldingsDto {
  @ApiProperty({
    description: "Array of holdings",
    type: [HoldingDto],
  })
  holdings: HoldingDto[];
}


import { ApiProperty } from "@nestjs/swagger";

export class HoldingDto {
  @ApiProperty({
    description: "Stock name",
    example: "Apple Inc.",
  })
  particulars: string;

  @ApiProperty({
    description: "Purchase price ",
    example: 150.5,
  })
  purchasePrice: number;

  @ApiProperty({
    description: "Quantity ",
    example: 10,
  })
  quantity: number;

  @ApiProperty({
    description: "exchange code",
    example: "NSE",
  })
  exchange: string;

  @ApiProperty({
    description: " symbol",
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

import { ApiProperty } from "@nestjs/swagger";

export class SymbolDto {
  @ApiProperty({
    description: "Single symbol or list of stock symbols",
    example: ["AAPL", "MSFT"],
    isArray: true,
    type: String,
  })
  symbol: string | string[];
}

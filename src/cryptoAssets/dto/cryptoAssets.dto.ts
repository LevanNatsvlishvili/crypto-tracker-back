import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class cryptoAssetDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  symbol: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  priceWhenBought: number;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @Type(() => Date) // Transforms input into a Date instance
  @IsDate()
  boughtAt: Date;
}

export class cryptoAssetFromCoinmarketcapDTO {
  @IsNotEmpty()
  start: string;

  @IsNotEmpty()
  limit: string;

  @IsNotEmpty()
  convert: string;
}

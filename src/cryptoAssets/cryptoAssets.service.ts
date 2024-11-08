import { Dependencies, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { cryptoAssetDTO, cryptoAssetFromCoinmarketcapDTO } from './dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

interface CryptoQuote {
  price: number;
  volume_24h: number;
  market_cap: number;
  last_updated: string;
}

interface CryptoAsset {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  quote: {
    USD: CryptoQuote; // Ensure this matches the structure returned by the API
  };
}

interface CryptoAssetPrices {
  symbol: string;
  price: number;
}

interface CryptoAssetQuote {
  [symbol: string]: CryptoAsset;
}

@Injectable()
export class CryptoAssetsService {
  private readonly apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
  private readonly apiUrl2 = '/v1/cryptocurrency/ohlcv/historical';
  private readonly apiKey = 'f5fa0268-be8c-4948-93f0-b9a0527a7fed';

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async enterCryptoAsset(dto: cryptoAssetDTO) {
    try {
      const asset = await this.prisma.cryptoAssets.create({
        data: {
          name: dto.name,
          amount: dto.amount,
          priceWhenBought: dto.priceWhenBought,
          symbol: dto.symbol,
          boughtAt: dto.boughtAt,
          userId: dto.userId,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      });
      return asset;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Asset with this name already exists');
        }
      }
      throw e;
    }
  }

  async getCryptoAssetPricesFromCoinmarketcap(assetSymbols: string[]): Promise<any> {
    try {
      const response$ = this.httpService.get<AxiosResponse<CryptoAssetQuote>>(this.apiUrl, {
        headers: {
          Accept: 'application/json',
          'X-CMC_PRO_API_KEY': this.apiKey, // Ensure this comes from a secure source like process.env
        },
        params: {
          symbol: assetSymbols.join(','),
          convert: 'USD',
        },
      });

      const response = await lastValueFrom(response$);
      const data: CryptoAssetQuote = response.data.data;

      // Use proper TypeScript handling to ensure `USD` exists
      const prices = Object.entries(data).map(([symbol, asset]) => {
        if (asset.quote && asset.quote.USD) {
          return {
            symbol,
            price: asset.quote.USD.price,
          };
        } else {
          throw new Error(`Price data for ${symbol} is missing or improperly formatted.`);
        }
      });

      return prices;
    } catch (error) {
      console.warn(error.response?.data?.status?.error_message || error.message);
      if (error.response?.data?.status?.error_message) {
        return error.response?.data?.status;
      }
      throw new Error(`Failed to fetch crypto assets: ${error.message}`);
    }
  }

  // Add business logic that will calculate current value and profit/loss
  async getAssets(userId: number) {
    const myAssets = await this.prisma.cryptoAssets.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        amount: true,
        priceWhenBought: true,
        symbol: true,
        boughtAt: true,
        createdAt: true,
      },
    });

    const symbols = myAssets.map((asset) => asset.symbol);
    const prices = await this.getCryptoAssetPricesFromCoinmarketcap(symbols);

    const calculatedCollection = myAssets.map((asset) => {
      const currentPrice = prices.find(
        (price: CryptoAssetPrices) => price.symbol.toLocaleLowerCase() === asset.symbol.toLocaleLowerCase(),
      )?.price;
      const currentHolding = currentPrice * asset.amount;
      const fullHoldingWhenBought = asset.priceWhenBought * asset.amount;
      const profit = ((currentHolding - fullHoldingWhenBought) / fullHoldingWhenBought) * 100;
      const daysPassed = Math.floor(
        (new Date().getTime() - new Date(asset.boughtAt).getTime()) / (1000 * 60 * 60 * 24),
      );
      // if (currentPrice) {
      //   asset.currentPrice = currentPrice;
      //   asset.profit = (currentPrice - asset.priceWhenBought) * asset.amount;
      // }
      return {
        ...asset,
        currentPrice,
        currentHolding,
        profit,
        daysPassed,
        weeksPassed: Math.floor(daysPassed / 7),
        monthsPassed: Math.floor(daysPassed / 30),
        // profit: currentPrice ? (currentPrice - asset.priceWhenBought) * asset.amount : 0,
      };
    });
    return calculatedCollection;
  }
}

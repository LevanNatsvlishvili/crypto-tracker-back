import { Dependencies, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { cryptoAssetDTO, cryptoAssetFromCoinmarketcapDTO } from './dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class CryptoAssetsService {
  private readonly apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
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

  async getCryptoAssetsFromCoinmarketcap(dto: cryptoAssetFromCoinmarketcapDTO): Promise<any> {
    try {
      // Log the query parameters to verify they are correct
      console.log('Query Parameters:', dto.start, dto.limit, dto.convert);

      const response$ = this.httpService.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
        headers: {
          Accept: 'application/json',
          'X-CMC_PRO_API_KEY': this.apiKey, // Ensure this comes from a secure source like process.env
        },
        params: {
          start: dto.start,
          limit: dto.limit,
          convert: dto.convert,
        },
      });

      // Convert Observable to a Promise and extract the `data` property
      const response = await lastValueFrom(response$);
      return response.data; // Only return the `data` property
    } catch (error) {
      // console.error('Error details:', error.response?.data || error.message);
      console.warn(error.response?.data.status.error_message);
      if (error.response?.data.status.error_message) {
        return error.response?.data.status;
        throw new Error(`Failed to fetch crypto assets: ${error.response?.data.status.error_message}`);
      }
      throw new Error(`Failed to fetch crypto assets: ${error.message}`);
    }
  }

  // async getCryptoAssetsFromCoinmarketcap(): Promise<any> {
  //   try {
  //     const response$ = this.httpService.get(this.apiUrl, {
  //       headers: {
  //         Accepts: 'application/json',
  //         'X-CMC_PRO_API_KEY': this.apiKey,
  //       },
  //       params: {
  //         start: '1',
  //         limit: '100',
  //         convert: 'USD',
  //       },
  //     });

  //     // Convert Observable to a Promise
  //     const response = await lastValueFrom(response$);
  //     return response.data;
  //   } catch (error) {
  //     throw new Error(`Failed to fetch crypto assets: ${error.message}`);
  //   }
  // }

  // Add business logic that will calculate current value and profit/loss
  getAssets(userId: number) {
    return this.prisma.cryptoAssets.findMany({
      where: {
        userId,
      },
    });
  }
}

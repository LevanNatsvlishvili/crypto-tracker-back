import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { cryptoAssetDTO } from './dto';

@Injectable()
export class CryptoAssetsService {
  constructor(private prisma: PrismaService) {}

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

  // Add business logic that will calculate current value and profit/loss
  getAssets(userId: number) {
    return this.prisma.cryptoAssets.findMany({
      where: {
        userId,
      },
    });
  }
}

import { Controller, Get, Post, Body, UseGuards, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { Users } from '@prisma/client';
// import { GetUser } from 'src/auth/decorator';
import { cryptoAssetDTO, cryptoAssetFromCoinmarketcapDTO } from './dto';
import { CryptoAssetsService } from './cryptoAssets.service';

@UseGuards(AuthGuard('jwt'))
@Controller('crypto-assets')
export class CryptoAssetsController {
  constructor(private cryptoAssets: CryptoAssetsService) {}

  @Post()
  enterCryptoAsset(@Body() dto: cryptoAssetDTO) {
    return this.cryptoAssets.enterCryptoAsset(dto);
  }

  @Get('/crypto-list')
  async getCryptoAssetsFromCoinmarketcap(@Query() query: cryptoAssetFromCoinmarketcapDTO) {
    return this.cryptoAssets.getCryptoAssetsFromCoinmarketcap(query);
  }

  @Get(':userId')
  async getCryptoAssetsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.cryptoAssets.getAssets(userId);
  }
}

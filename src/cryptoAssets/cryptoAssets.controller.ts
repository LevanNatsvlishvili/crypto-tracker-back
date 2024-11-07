import { Controller, Get, Post, Body, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { Users } from '@prisma/client';
// import { GetUser } from 'src/auth/decorator';
import { cryptoAssetDTO } from './dto';
import { CryptoAssetsService } from './cryptoAssets.service';

@UseGuards(AuthGuard('jwt'))
@Controller('crypto-assets')
export class CryptoAssetsController {
  constructor(private cryptoAssets: CryptoAssetsService) {}

  @Post()
  enterCryptoAsset(@Body() dto: cryptoAssetDTO) {
    return this.cryptoAssets.enterCryptoAsset(dto);
  }

  @Get(':userId')
  async getCryptoAssetsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.cryptoAssets.getAssets(userId);
  }
}

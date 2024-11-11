import { Controller, Get, Post, Body, UseGuards, Param, ParseIntPipe, Put, Delete } from '@nestjs/common';
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

  @Put(':id')
  updateCryptoAsset(@Param('id') id: number, @Body() dto: cryptoAssetDTO) {
    return this.cryptoAssets.updateCryptoAsset(id, dto);
  }

  @Delete(':id')
  deleteCryptoAsset(@Param('id') id: number) {
    return this.cryptoAssets.deleteCryptoAsset(id);
  }

  @Get(':userId')
  async getCryptoAssetsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.cryptoAssets.getAssets(userId);
  }
}

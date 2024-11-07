import { Module } from '@nestjs/common';
import { CryptoAssetsController } from './cryptoAssets.controller';
import { CryptoAssetsService } from './cryptoAssets.service';

@Module({
  controllers: [CryptoAssetsController],
  providers: [CryptoAssetsService],
})
export class CryptoAssetsModule {}

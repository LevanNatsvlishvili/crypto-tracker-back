import { Module } from '@nestjs/common';
import { CryptoAssetsController } from './cryptoAssets.controller';
import { CryptoAssetsService } from './cryptoAssets.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [CryptoAssetsController],
  imports: [HttpModule],
  providers: [CryptoAssetsService],
})
export class CryptoAssetsModule {}

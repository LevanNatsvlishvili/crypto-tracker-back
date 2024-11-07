import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { CryptoAssetsModule } from './cryptoAssets/cryptoAssets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // For Env variables
    AuthModule,
    PrismaModule,
    UsersModule,
    AssetsModule,
    CryptoAssetsModule,
  ],
  providers: [],
})
export class AppModule {}

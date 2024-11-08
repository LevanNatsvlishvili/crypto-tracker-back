/*
  Warnings:

  - Made the column `priceWhenBought` on table `CryptoAssets` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CryptoAssets" ALTER COLUMN "priceWhenBought" SET NOT NULL;

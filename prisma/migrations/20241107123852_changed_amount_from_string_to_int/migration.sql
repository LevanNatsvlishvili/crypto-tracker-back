/*
  Warnings:

  - Changed the type of `amount` on the `CryptoAssets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CryptoAssets" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "amount",
ADD COLUMN     "amount" INTEGER NOT NULL;

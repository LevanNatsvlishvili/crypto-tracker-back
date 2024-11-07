/*
  Warnings:

  - A unique constraint covering the columns `[symbol]` on the table `CryptoAssets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `symbol` to the `CryptoAssets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CryptoAssets" ADD COLUMN     "symbol" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAssets_symbol_key" ON "CryptoAssets"("symbol");

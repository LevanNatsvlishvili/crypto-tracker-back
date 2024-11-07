/*
  Warnings:

  - You are about to drop the column `asset` on the `CryptoAssets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `CryptoAssets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `CryptoAssets` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CryptoAssets_asset_key";

-- AlterTable
ALTER TABLE "CryptoAssets" DROP COLUMN "asset",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAssets_name_key" ON "CryptoAssets"("name");

-- CreateTable
CREATE TABLE "CryptoAssets" (
    "id" SERIAL NOT NULL,
    "asset" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "boughtAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CryptoAssets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAssets_asset_key" ON "CryptoAssets"("asset");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAssets_amount_key" ON "CryptoAssets"("amount");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAssets_userId_key" ON "CryptoAssets"("userId");

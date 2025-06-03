/*
  Warnings:

  - You are about to drop the column `sucursalId` on the `StockThreshold` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productoId]` on the table `StockThreshold` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "TipoNotificacion" ADD VALUE 'STOCK_BAJO';

-- DropForeignKey
ALTER TABLE "StockThreshold" DROP CONSTRAINT "StockThreshold_sucursalId_fkey";

-- DropIndex
DROP INDEX "StockThreshold_productoId_sucursalId_key";

-- AlterTable
ALTER TABLE "StockThreshold" DROP COLUMN "sucursalId";

-- CreateIndex
CREATE UNIQUE INDEX "StockThreshold_productoId_key" ON "StockThreshold"("productoId");

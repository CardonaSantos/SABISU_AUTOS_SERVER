/*
  Warnings:

  - A unique constraint covering the columns `[referenciaPago]` on the table `Venta` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TipoComprobante" AS ENUM ('FACTURA', 'RECIBO');

-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "referenciaPago" TEXT,
ADD COLUMN     "tipoComprobante" "TipoComprobante" NOT NULL DEFAULT 'RECIBO';

-- CreateIndex
CREATE UNIQUE INDEX "Venta_referenciaPago_key" ON "Venta"("referenciaPago");

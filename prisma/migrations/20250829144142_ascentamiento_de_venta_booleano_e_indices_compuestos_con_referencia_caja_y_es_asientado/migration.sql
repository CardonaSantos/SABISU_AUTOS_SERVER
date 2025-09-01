/*
  Warnings:

  - A unique constraint covering the columns `[registroCajaId,referencia]` on the table `MovimientoFinanciero` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MovimientoFinanciero" ADD COLUMN     "esAsientoVentas" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "MovimientoFinanciero_registroCajaId_esAsientoVentas_idx" ON "MovimientoFinanciero"("registroCajaId", "esAsientoVentas");

-- CreateIndex
CREATE UNIQUE INDEX "uq_movfin_turno_referencia" ON "MovimientoFinanciero"("registroCajaId", "referencia");

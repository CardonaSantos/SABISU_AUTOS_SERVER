/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `RegistroGarantia` table. All the data in the column will be lost.
  - Added the required column `cantidadDevuelta` to the `Garantia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ventaId` to the `Garantia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cantidadProcesada` to the `RegistroGarantia` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoDetalleVenta" AS ENUM ('VENDIDO', 'PARCIAL_GARANTIA', 'ANULADO');

-- DropForeignKey
ALTER TABLE "Garantia" DROP CONSTRAINT "Garantia_productoId_fkey";

-- DropForeignKey
ALTER TABLE "RegistroGarantia" DROP CONSTRAINT "RegistroGarantia_productoId_fkey";

-- DropForeignKey
ALTER TABLE "RegistroGarantia" DROP CONSTRAINT "RegistroGarantia_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Garantia" ADD COLUMN     "cantidadDevuelta" INTEGER NOT NULL,
ADD COLUMN     "ventaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RegistroGarantia" DROP COLUMN "usuarioId",
ADD COLUMN     "cantidadProcesada" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "NotaCredito" (
    "id" SERIAL NOT NULL,
    "ventaId" INTEGER NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "motivo" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotaCredito_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Garantia" ADD CONSTRAINT "Garantia_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Garantia" ADD CONSTRAINT "Garantia_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotaCredito" ADD CONSTRAINT "NotaCredito_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

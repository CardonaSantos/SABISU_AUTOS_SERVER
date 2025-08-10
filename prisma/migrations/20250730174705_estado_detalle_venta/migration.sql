/*
  Warnings:

  - You are about to drop the `NotaCredito` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NotaCredito" DROP CONSTRAINT "NotaCredito_ventaId_fkey";

-- AlterTable
ALTER TABLE "VentaProducto" ADD COLUMN     "estado" "EstadoDetalleVenta" NOT NULL DEFAULT 'VENDIDO';

-- DropTable
DROP TABLE "NotaCredito";

-- CreateEnum
CREATE TYPE "OrigenCompra" AS ENUM ('DIRECTA', 'REQUISICION', 'PEDIDO');

-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "origen" "OrigenCompra" NOT NULL DEFAULT 'DIRECTA';

-- CreateEnum
CREATE TYPE "EstadoCompra" AS ENUM ('RECIBIDO', 'CANCELADO', 'RECIBIDO_PARCIAL', 'ESPERANDO_ENTREGA');

-- AlterEnum
ALTER TYPE "RequisicionEstado" ADD VALUE 'ENVIADA_COMPRAS';

-- DropForeignKey
ALTER TABLE "Compra" DROP CONSTRAINT "Compra_proveedorId_fkey";

-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "estado" "EstadoCompra" NOT NULL DEFAULT 'ESPERANDO_ENTREGA',
ALTER COLUMN "proveedorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SucursalSaldoDiario" ALTER COLUMN "fechaGenerado" SET DEFAULT (CURRENT_DATE);

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

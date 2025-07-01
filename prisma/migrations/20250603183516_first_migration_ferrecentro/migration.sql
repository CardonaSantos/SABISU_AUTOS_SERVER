-- AlterEnum
ALTER TYPE "ResumenPeriodo" ADD VALUE 'CUSTOM';

-- AlterTable
ALTER TABLE "ImagenProducto" ADD COLUMN     "public_id" TEXT;

-- AlterTable
ALTER TABLE "Requisicion" ADD COLUMN     "totalRequisicion" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ResumenVenta" ADD COLUMN     "cantidadProductoTop" INTEGER,
ADD COLUMN     "titulo" TEXT;

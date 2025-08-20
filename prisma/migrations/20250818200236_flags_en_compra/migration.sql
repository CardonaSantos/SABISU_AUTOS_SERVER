-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "cantidadRecibidaAcumulada" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ingresadaAStock" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SucursalSaldoDiario" ALTER COLUMN "fechaGenerado" SET DEFAULT (CURRENT_DATE);

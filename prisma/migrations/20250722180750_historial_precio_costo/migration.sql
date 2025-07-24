-- AlterTable
ALTER TABLE "HistorialPrecioCosto" ADD COLUMN     "motivoCambio" TEXT,
ADD COLUMN     "sucursalId" INTEGER;

-- AddForeignKey
ALTER TABLE "HistorialPrecioCosto" ADD CONSTRAINT "HistorialPrecioCosto_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

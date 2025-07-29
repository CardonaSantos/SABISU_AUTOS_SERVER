-- DropForeignKey
ALTER TABLE "HistorialStock" DROP CONSTRAINT "HistorialStock_ventaId_fkey";

-- AddForeignKey
ALTER TABLE "HistorialStock" ADD CONSTRAINT "HistorialStock_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

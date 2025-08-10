-- AlterTable
ALTER TABLE "HistorialStock" ADD COLUMN     "garantiaId" INTEGER;

-- AddForeignKey
ALTER TABLE "HistorialStock" ADD CONSTRAINT "HistorialStock_garantiaId_fkey" FOREIGN KEY ("garantiaId") REFERENCES "Garantia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

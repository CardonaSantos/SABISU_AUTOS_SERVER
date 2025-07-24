-- DropForeignKey
ALTER TABLE "HistorialStock" DROP CONSTRAINT "HistorialStock_requisicionId_fkey";

-- AddForeignKey
ALTER TABLE "HistorialStock" ADD CONSTRAINT "HistorialStock_requisicionId_fkey" FOREIGN KEY ("requisicionId") REFERENCES "Requisicion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

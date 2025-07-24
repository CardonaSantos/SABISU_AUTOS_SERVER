-- DropForeignKey
ALTER TABLE "RequisicionRecepcionLinea" DROP CONSTRAINT "RequisicionRecepcionLinea_requisicionLineaId_fkey";

-- AddForeignKey
ALTER TABLE "RequisicionRecepcionLinea" ADD CONSTRAINT "RequisicionRecepcionLinea_requisicionLineaId_fkey" FOREIGN KEY ("requisicionLineaId") REFERENCES "RequisicionLinea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

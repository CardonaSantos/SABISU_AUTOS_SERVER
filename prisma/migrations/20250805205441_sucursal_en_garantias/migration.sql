-- AlterTable
ALTER TABLE "Garantia" ADD COLUMN     "sucursalId" INTEGER;

-- AddForeignKey
ALTER TABLE "Garantia" ADD CONSTRAINT "Garantia_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

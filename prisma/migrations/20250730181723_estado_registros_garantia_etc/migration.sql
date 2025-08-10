/*
  Warnings:

  - You are about to drop the column `cantidadProcesada` on the `RegistroGarantia` table. All the data in the column will be lost.
  - You are about to drop the column `proveedorId` on the `RegistroGarantia` table. All the data in the column will be lost.
  - Added the required column `actualizadoEn` to the `RegistroGarantia` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RegistroGarantia" DROP CONSTRAINT "RegistroGarantia_proveedorId_fkey";

-- AlterTable
ALTER TABLE "RegistroGarantia" DROP COLUMN "cantidadProcesada",
DROP COLUMN "proveedorId",
ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usuarioId" INTEGER;

-- AddForeignKey
ALTER TABLE "RegistroGarantia" ADD CONSTRAINT "RegistroGarantia_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroGarantia" ADD CONSTRAINT "RegistroGarantia_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

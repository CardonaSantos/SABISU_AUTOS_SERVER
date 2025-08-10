/*
  Warnings:

  - You are about to drop the column `comentarioFinal` on the `RegistroCaja` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MovimientoCaja" DROP CONSTRAINT "MovimientoCaja_registroCajaId_fkey";

-- AlterTable
ALTER TABLE "MovimientoCaja" ALTER COLUMN "registroCajaId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RegistroCaja" DROP COLUMN "comentarioFinal",
ADD COLUMN     "movimientoCaja" TEXT;

-- AlterTable
ALTER TABLE "SucursalSaldoDiario" ALTER COLUMN "fechaGenerado" SET DEFAULT (CURRENT_DATE);

-- AddForeignKey
ALTER TABLE "MovimientoCaja" ADD CONSTRAINT "MovimientoCaja_registroCajaId_fkey" FOREIGN KEY ("registroCajaId") REFERENCES "RegistroCaja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

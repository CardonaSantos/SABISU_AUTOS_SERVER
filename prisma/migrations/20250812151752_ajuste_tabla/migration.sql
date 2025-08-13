/*
  Warnings:

  - The `movimientoCaja` column on the `RegistroCaja` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "RegistroCaja" DROP COLUMN "movimientoCaja",
ADD COLUMN     "movimientoCaja" INTEGER;

-- AlterTable
ALTER TABLE "SucursalSaldoDiario" ALTER COLUMN "fechaGenerado" SET DEFAULT (CURRENT_DATE);

-- AlterTable
ALTER TABLE "RegistroCaja" ADD COLUMN     "comentarioFinal" TEXT;

-- AlterTable
ALTER TABLE "SucursalSaldoDiario" ALTER COLUMN "fechaGenerado" SET DEFAULT (CURRENT_DATE);

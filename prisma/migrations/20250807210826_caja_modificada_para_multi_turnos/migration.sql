-- AlterTable
ALTER TABLE "RegistroCaja" ADD COLUMN     "depositado" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SucursalSaldoDiario" ADD COLUMN     "fechaGenerado" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE);

-- DropEnum
DROP TYPE "EstadoCaja";

-- DropEnum
DROP TYPE "EstadoMovimientoCaja";

-- CreateEnum
CREATE TYPE "GastoOperativoTipo" AS ENUM ('SALARIO', 'ENERGIA', 'LOGISTICA', 'RENTA', 'INTERNET', 'PUBLICIDAD', 'VIATICOS', 'OTROS');

-- AlterTable
ALTER TABLE "MovimientoCaja" ADD COLUMN     "gastoOperativoTipo" "GastoOperativoTipo";

-- AlterTable
ALTER TABLE "SucursalSaldoDiario" ALTER COLUMN "fechaGenerado" SET DEFAULT (CURRENT_DATE);

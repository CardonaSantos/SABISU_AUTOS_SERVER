-- AlterTable
ALTER TABLE "MovimientoCaja" ALTER COLUMN "categoria" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SucursalSaldoDiario" ALTER COLUMN "fechaGenerado" SET DEFAULT (CURRENT_DATE);

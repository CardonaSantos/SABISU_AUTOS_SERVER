/*
  Warnings:

  - You are about to drop the column `movimientoCaja` on the `RegistroCaja` table. All the data in the column will be lost.
  - You are about to alter the column `saldoInicial` on the `RegistroCaja` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - You are about to alter the column `saldoFinal` on the `RegistroCaja` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - You are about to drop the column `egresosTotal` on the `SaldoGlobalDiario` table. All the data in the column will be lost.
  - You are about to drop the column `ingresosTotal` on the `SaldoGlobalDiario` table. All the data in the column will be lost.
  - You are about to drop the column `saldoTotal` on the `SaldoGlobalDiario` table. All the data in the column will be lost.
  - You are about to drop the column `fechaGenerado` on the `SucursalSaldoDiario` table. All the data in the column will be lost.
  - You are about to drop the column `saldoFinal` on the `SucursalSaldoDiario` table. All the data in the column will be lost.
  - You are about to drop the column `saldoInicio` on the `SucursalSaldoDiario` table. All the data in the column will be lost.
  - You are about to drop the column `totalEgresos` on the `SucursalSaldoDiario` table. All the data in the column will be lost.
  - You are about to drop the column `totalIngresos` on the `SucursalSaldoDiario` table. All the data in the column will be lost.
  - You are about to drop the `MovimientoCaja` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `egresosTotalBanco` to the `SaldoGlobalDiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `egresosTotalCaja` to the `SaldoGlobalDiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingresosTotalBanco` to the `SaldoGlobalDiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingresosTotalCaja` to the `SaldoGlobalDiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saldoTotalBanco` to the `SaldoGlobalDiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saldoTotalCaja` to the `SaldoGlobalDiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `egresosBanco` to the `SucursalSaldoDiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `egresosCaja` to the `SucursalSaldoDiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingresosBanco` to the `SucursalSaldoDiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingresosCaja` to the `SucursalSaldoDiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saldoFinalBanco` to the `SucursalSaldoDiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saldoFinalCaja` to the `SucursalSaldoDiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saldoInicioBanco` to the `SucursalSaldoDiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saldoInicioCaja` to the `SucursalSaldoDiario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClasificacionAdmin" AS ENUM ('INGRESO', 'COSTO_VENTA', 'GASTO_OPERATIVO', 'TRANSFERENCIA', 'AJUSTE', 'CONTRAVENTA');

-- CreateEnum
CREATE TYPE "MotivoMovimiento" AS ENUM ('VENTA', 'OTRO_INGRESO', 'GASTO_OPERATIVO', 'COMPRA_MERCADERIA', 'COSTO_ASOCIADO', 'DEPOSITO_CIERRE', 'DEPOSITO_PROVEEDOR', 'PAGO_PROVEEDOR_BANCO', 'AJUSTE_SOBRANTE', 'AJUSTE_FALTANTE', 'DEVOLUCION');

-- CreateEnum
CREATE TYPE "CostoVentaTipo" AS ENUM ('MERCADERIA', 'FLETE', 'ENCOMIENDA', 'TRANSPORTE', 'OTROS');

-- DropForeignKey
ALTER TABLE "MovimientoCaja" DROP CONSTRAINT "MovimientoCaja_proveedorId_fkey";

-- DropForeignKey
ALTER TABLE "MovimientoCaja" DROP CONSTRAINT "MovimientoCaja_registroCajaId_fkey";

-- DropForeignKey
ALTER TABLE "MovimientoCaja" DROP CONSTRAINT "MovimientoCaja_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "RegistroCaja" DROP CONSTRAINT "RegistroCaja_sucursalId_fkey";

-- AlterTable
ALTER TABLE "RegistroCaja" DROP COLUMN "movimientoCaja",
ADD COLUMN     "fondoFijo" DECIMAL(14,2) NOT NULL DEFAULT 0,
ALTER COLUMN "saldoInicial" SET DATA TYPE DECIMAL(14,2),
ALTER COLUMN "saldoFinal" SET DATA TYPE DECIMAL(14,2);

-- AlterTable
ALTER TABLE "SaldoGlobalDiario" DROP COLUMN "egresosTotal",
DROP COLUMN "ingresosTotal",
DROP COLUMN "saldoTotal",
ADD COLUMN     "egresosTotalBanco" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "egresosTotalCaja" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "ingresosTotalBanco" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "ingresosTotalCaja" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "saldoTotalBanco" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "saldoTotalCaja" DECIMAL(14,2) NOT NULL,
ALTER COLUMN "fecha" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SucursalSaldoDiario" DROP COLUMN "fechaGenerado",
DROP COLUMN "saldoFinal",
DROP COLUMN "saldoInicio",
DROP COLUMN "totalEgresos",
DROP COLUMN "totalIngresos",
ADD COLUMN     "egresosBanco" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "egresosCaja" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "ingresosBanco" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "ingresosCaja" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "saldoFinalBanco" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "saldoFinalCaja" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "saldoInicioBanco" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "saldoInicioCaja" DECIMAL(14,2) NOT NULL,
ALTER COLUMN "fecha" DROP DEFAULT;

-- DropTable
DROP TABLE "MovimientoCaja";

-- DropEnum
DROP TYPE "CategoriaMovimiento";

-- DropEnum
DROP TYPE "TipoMovimientoCaja";

-- CreateTable
CREATE TABLE "MovimientoFinanciero" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sucursalId" INTEGER NOT NULL,
    "registroCajaId" INTEGER,
    "clasificacion" "ClasificacionAdmin" NOT NULL,
    "motivo" "MotivoMovimiento" NOT NULL,
    "metodoPago" "MetodoPago",
    "deltaCaja" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "deltaBanco" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "cuentaBancariaId" INTEGER,
    "descripcion" TEXT,
    "referencia" TEXT,
    "conFactura" BOOLEAN,
    "esDepositoCierre" BOOLEAN NOT NULL DEFAULT false,
    "esDepositoProveedor" BOOLEAN NOT NULL DEFAULT false,
    "proveedorId" INTEGER,
    "gastoOperativoTipo" "GastoOperativoTipo",
    "costoVentaTipo" "CostoVentaTipo",
    "afectaInventario" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovimientoFinanciero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuentaBancaria" (
    "id" SERIAL NOT NULL,
    "banco" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "alias" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CuentaBancaria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MovimientoFinanciero_sucursalId_fecha_idx" ON "MovimientoFinanciero"("sucursalId", "fecha");

-- CreateIndex
CREATE INDEX "MovimientoFinanciero_registroCajaId_idx" ON "MovimientoFinanciero"("registroCajaId");

-- CreateIndex
CREATE INDEX "MovimientoFinanciero_clasificacion_motivo_idx" ON "MovimientoFinanciero"("clasificacion", "motivo");

-- CreateIndex
CREATE INDEX "MovimientoFinanciero_esDepositoCierre_esDepositoProveedor_idx" ON "MovimientoFinanciero"("esDepositoCierre", "esDepositoProveedor");

-- CreateIndex
CREATE UNIQUE INDEX "CuentaBancaria_banco_numero_key" ON "CuentaBancaria"("banco", "numero");

-- CreateIndex
CREATE INDEX "RegistroCaja_sucursalId_estado_idx" ON "RegistroCaja"("sucursalId", "estado");

-- AddForeignKey
ALTER TABLE "RegistroCaja" ADD CONSTRAINT "RegistroCaja_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoFinanciero" ADD CONSTRAINT "MovimientoFinanciero_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoFinanciero" ADD CONSTRAINT "MovimientoFinanciero_registroCajaId_fkey" FOREIGN KEY ("registroCajaId") REFERENCES "RegistroCaja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoFinanciero" ADD CONSTRAINT "MovimientoFinanciero_cuentaBancariaId_fkey" FOREIGN KEY ("cuentaBancariaId") REFERENCES "CuentaBancaria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoFinanciero" ADD CONSTRAINT "MovimientoFinanciero_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoFinanciero" ADD CONSTRAINT "MovimientoFinanciero_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

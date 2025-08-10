/*
  Warnings:

  - You are about to drop the `Deposito` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Egreso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SucursalSaldoGlobal` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `actualizadoEn` to the `Compra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `CompraDetalle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `MovimientoCaja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `MovimientoCaja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `RegistroCaja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `SaldoGlobalDiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `SucursalSaldoDiario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Deposito" DROP CONSTRAINT "Deposito_registroCajaId_fkey";

-- DropForeignKey
ALTER TABLE "Deposito" DROP CONSTRAINT "Deposito_sucursalId_fkey";

-- DropForeignKey
ALTER TABLE "Deposito" DROP CONSTRAINT "Deposito_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Egreso" DROP CONSTRAINT "Egreso_registroCajaId_fkey";

-- DropForeignKey
ALTER TABLE "Egreso" DROP CONSTRAINT "Egreso_sucursalId_fkey";

-- DropForeignKey
ALTER TABLE "Egreso" DROP CONSTRAINT "Egreso_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "conFactura" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "facturaFecha" TIMESTAMP(3),
ADD COLUMN     "facturaNumero" TEXT;

-- AlterTable
ALTER TABLE "CompraDetalle" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MovimientoCaja" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "banco" TEXT,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "numeroBoleta" TEXT,
ADD COLUMN     "proveedorId" INTEGER,
ADD COLUMN     "usadoParaCierre" BOOLEAN,
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RegistroCaja" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SaldoGlobalDiario" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "usuarioId" INTEGER;

-- AlterTable
ALTER TABLE "SucursalSaldoDiario" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Deposito";

-- DropTable
DROP TABLE "Egreso";

-- DropTable
DROP TABLE "SucursalSaldoGlobal";

-- AddForeignKey
ALTER TABLE "SaldoGlobalDiario" ADD CONSTRAINT "SaldoGlobalDiario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoCaja" ADD CONSTRAINT "MovimientoCaja_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoCaja" ADD CONSTRAINT "MovimientoCaja_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

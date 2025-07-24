/*
  Warnings:

  - You are about to drop the column `comentario` on the `RegistroCaja` table. All the data in the column will be lost.
  - You are about to drop the column `fechaInicio` on the `RegistroCaja` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `RegistroCaja` table. All the data in the column will be lost.
  - The `estado` column on the `RegistroCaja` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `sucursalId` to the `HistorialStock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `HistorialStock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orden` to the `PrecioProducto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rol` to the `PrecioProducto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioInicioId` to the `RegistroCaja` table without a default value. This is not possible if the table is not empty.
  - Made the column `sucursalId` on table `RegistroCaja` required. This step will fail if there are existing NULL values in that column.
  - Made the column `saldoInicial` on table `RegistroCaja` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "EstadoMovimientoCaja" AS ENUM ('ACTIVO', 'ANULADO', 'AJUSTADO');

-- CreateEnum
CREATE TYPE "EstadoTurnoCaja" AS ENUM ('ABIERTO', 'CERRADO', 'ARQUEO', 'AJUSTADO', 'ANULADO');

-- CreateEnum
CREATE TYPE "TipoMovimientoCaja" AS ENUM ('INGRESO', 'EGRESO', 'VENTA', 'ABONO', 'RETIRO', 'DEPOSITO_BANCO', 'CHEQUE', 'TRANSFERENCIA', 'AJUSTE', 'DEVOLUCION', 'OTRO');

-- CreateEnum
CREATE TYPE "RolPrecio" AS ENUM ('PUBLICO', 'MAYORISTA', 'ESPECIAL', 'DISTRIBUIDOR');

-- CreateEnum
CREATE TYPE "TipoMovimientoStock" AS ENUM ('INGRESO_COMPRA', 'INGRESO_REQUISICION', 'INGRESO_DEVOLUCION_CLIENTE', 'INGRESO_TRANSFERENCIA', 'INGRESO_AJUSTE', 'SALIDA_VENTA', 'SALIDA_DEVOLUCION_PROVEEDOR', 'SALIDA_AJUSTE', 'SALIDA_TRANSFERENCIA', 'SALIDA_REPARACION', 'ELIMINACION', 'INVENTARIO_INICIAL', 'OTRO');

-- DropForeignKey
ALTER TABLE "RegistroCaja" DROP CONSTRAINT "RegistroCaja_sucursalId_fkey";

-- DropForeignKey
ALTER TABLE "RegistroCaja" DROP CONSTRAINT "RegistroCaja_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "eliminado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fechaEliminacion" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "HistorialStock" ADD COLUMN     "ajusteStockId" INTEGER,
ADD COLUMN     "comentario" TEXT,
ADD COLUMN     "eliminacionStockId" INTEGER,
ADD COLUMN     "eliminacionVentaId" INTEGER,
ADD COLUMN     "entregaStockId" INTEGER,
ADD COLUMN     "requisicionId" INTEGER,
ADD COLUMN     "sucursalId" INTEGER NOT NULL,
ADD COLUMN     "tipo" "TipoMovimientoStock" NOT NULL,
ADD COLUMN     "transferenciaProductoId" INTEGER,
ADD COLUMN     "usuarioId" INTEGER,
ADD COLUMN     "ventaId" INTEGER;

-- AlterTable
ALTER TABLE "PrecioProducto" ADD COLUMN     "clienteId" INTEGER,
ADD COLUMN     "orden" INTEGER NOT NULL,
ADD COLUMN     "rol" "RolPrecio" NOT NULL,
ADD COLUMN     "sucursalId" INTEGER,
ADD COLUMN     "vigenteDesde" TIMESTAMP(3),
ADD COLUMN     "vigenteHasta" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "RegistroCaja" DROP COLUMN "comentario",
DROP COLUMN "fechaInicio",
DROP COLUMN "usuarioId",
ADD COLUMN     "comentarios" TEXT,
ADD COLUMN     "fechaApertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "usuarioCierreId" INTEGER,
ADD COLUMN     "usuarioInicioId" INTEGER NOT NULL,
ALTER COLUMN "sucursalId" SET NOT NULL,
ALTER COLUMN "saldoInicial" SET NOT NULL,
ALTER COLUMN "saldoFinal" DROP DEFAULT,
ALTER COLUMN "fechaCierre" DROP DEFAULT,
DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoTurnoCaja" NOT NULL DEFAULT 'ABIERTO';

-- AlterTable
ALTER TABLE "Requisicion" ADD COLUMN     "esIngresoAutomatico" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fechaRecepcion" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "RequisicionLinea" ADD COLUMN     "cantidadRecibida" INTEGER,
ADD COLUMN     "ingresadaAStock" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "MovimientoCaja" (
    "id" SERIAL NOT NULL,
    "registroCajaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" "TipoMovimientoCaja" NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "descripcion" TEXT,
    "referencia" TEXT,

    CONSTRAINT "MovimientoCaja_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RegistroCaja" ADD CONSTRAINT "RegistroCaja_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroCaja" ADD CONSTRAINT "RegistroCaja_usuarioInicioId_fkey" FOREIGN KEY ("usuarioInicioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroCaja" ADD CONSTRAINT "RegistroCaja_usuarioCierreId_fkey" FOREIGN KEY ("usuarioCierreId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoCaja" ADD CONSTRAINT "MovimientoCaja_registroCajaId_fkey" FOREIGN KEY ("registroCajaId") REFERENCES "RegistroCaja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoCaja" ADD CONSTRAINT "MovimientoCaja_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialStock" ADD CONSTRAINT "HistorialStock_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialStock" ADD CONSTRAINT "HistorialStock_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialStock" ADD CONSTRAINT "HistorialStock_requisicionId_fkey" FOREIGN KEY ("requisicionId") REFERENCES "RequisicionLinea"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialStock" ADD CONSTRAINT "HistorialStock_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "VentaProducto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialStock" ADD CONSTRAINT "HistorialStock_ajusteStockId_fkey" FOREIGN KEY ("ajusteStockId") REFERENCES "AjusteStock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialStock" ADD CONSTRAINT "HistorialStock_eliminacionStockId_fkey" FOREIGN KEY ("eliminacionStockId") REFERENCES "EliminacionStock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialStock" ADD CONSTRAINT "HistorialStock_eliminacionVentaId_fkey" FOREIGN KEY ("eliminacionVentaId") REFERENCES "VentaEliminada"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialStock" ADD CONSTRAINT "HistorialStock_transferenciaProductoId_fkey" FOREIGN KEY ("transferenciaProductoId") REFERENCES "TransferenciaProducto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialStock" ADD CONSTRAINT "HistorialStock_entregaStockId_fkey" FOREIGN KEY ("entregaStockId") REFERENCES "EntregaStock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

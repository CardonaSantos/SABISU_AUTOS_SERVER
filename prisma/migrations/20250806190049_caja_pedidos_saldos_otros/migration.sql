/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `MovimientoCaja` table. All the data in the column will be lost.
  - You are about to drop the `SucursalSaldo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoria` to the `MovimientoCaja` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoriaMovimiento" AS ENUM ('COSTO_VENTA', 'DEPOSITO_CIERRE', 'DEPOSITO_PROVEEDOR', 'GASTO_OPERATIVO');

-- CreateEnum
CREATE TYPE "PedidoEstado" AS ENUM ('PENDIENTE', 'ENVIADO_COMPRAS', 'RECIBIDO', 'CANCELADO');

-- DropForeignKey
ALTER TABLE "MovimientoCaja" DROP CONSTRAINT "MovimientoCaja_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "SucursalSaldo" DROP CONSTRAINT "SucursalSaldo_sucursalId_fkey";

-- AlterTable
ALTER TABLE "MovimientoCaja" DROP COLUMN "usuarioId",
ADD COLUMN     "categoria" "CategoriaMovimiento" NOT NULL;

-- DropTable
DROP TABLE "SucursalSaldo";

-- CreateTable
CREATE TABLE "SucursalSaldoDiario" (
    "id" SERIAL NOT NULL,
    "sucursalId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "saldoInicio" DOUBLE PRECISION NOT NULL,
    "saldoFinal" DOUBLE PRECISION NOT NULL,
    "totalIngresos" DOUBLE PRECISION NOT NULL,
    "totalEgresos" DOUBLE PRECISION NOT NULL,
    "globalDiarioId" INTEGER,

    CONSTRAINT "SucursalSaldoDiario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaldoGlobalDiario" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "saldoTotal" DOUBLE PRECISION NOT NULL,
    "ingresosTotal" DOUBLE PRECISION NOT NULL,
    "egresosTotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SaldoGlobalDiario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" SERIAL NOT NULL,
    "sucursalId" INTEGER,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DOUBLE PRECISION NOT NULL,
    "requisicionId" INTEGER,
    "proveedorId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompraDetalle" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "costoUnitario" DOUBLE PRECISION NOT NULL,
    "productoId" INTEGER,
    "compraId" INTEGER NOT NULL,
    "requisicionLineaId" INTEGER,

    CONSTRAINT "CompraDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "folio" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sucursalId" INTEGER NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "estado" "PedidoEstado" NOT NULL DEFAULT 'PENDIENTE',
    "observaciones" TEXT,
    "totalLineas" INTEGER NOT NULL DEFAULT 0,
    "totalPedido" DOUBLE PRECISION,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "compraId" INTEGER,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoLinea" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PedidoLinea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SucursalSaldoDiario_sucursalId_fecha_key" ON "SucursalSaldoDiario"("sucursalId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "SaldoGlobalDiario_fecha_key" ON "SaldoGlobalDiario"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "Compra_requisicionId_key" ON "Compra"("requisicionId");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_folio_key" ON "Pedido"("folio");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_compraId_key" ON "Pedido"("compraId");

-- AddForeignKey
ALTER TABLE "SucursalSaldoDiario" ADD CONSTRAINT "SucursalSaldoDiario_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SucursalSaldoDiario" ADD CONSTRAINT "SucursalSaldoDiario_globalDiarioId_fkey" FOREIGN KEY ("globalDiarioId") REFERENCES "SaldoGlobalDiario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_requisicionId_fkey" FOREIGN KEY ("requisicionId") REFERENCES "Requisicion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompraDetalle" ADD CONSTRAINT "CompraDetalle_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompraDetalle" ADD CONSTRAINT "CompraDetalle_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompraDetalle" ADD CONSTRAINT "CompraDetalle_requisicionLineaId_fkey" FOREIGN KEY ("requisicionLineaId") REFERENCES "RequisicionLinea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoLinea" ADD CONSTRAINT "PedidoLinea_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoLinea" ADD CONSTRAINT "PedidoLinea_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

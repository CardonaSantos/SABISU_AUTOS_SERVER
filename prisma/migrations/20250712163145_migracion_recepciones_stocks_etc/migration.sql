-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "requisicionRecepcionId" INTEGER;

-- CreateTable
CREATE TABLE "RequisicionRecepcion" (
    "id" SERIAL NOT NULL,
    "requisicionId" INTEGER NOT NULL,
    "fechaRecepcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequisicionRecepcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequisicionRecepcionLinea" (
    "id" SERIAL NOT NULL,
    "requisicionRecepcionId" INTEGER NOT NULL,
    "requisicionLineaId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidadSolicitada" INTEGER NOT NULL,
    "cantidadRecibida" INTEGER NOT NULL,
    "ingresadaAStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequisicionRecepcionLinea_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RequisicionRecepcion" ADD CONSTRAINT "RequisicionRecepcion_requisicionId_fkey" FOREIGN KEY ("requisicionId") REFERENCES "Requisicion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequisicionRecepcion" ADD CONSTRAINT "RequisicionRecepcion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequisicionRecepcionLinea" ADD CONSTRAINT "RequisicionRecepcionLinea_requisicionRecepcionId_fkey" FOREIGN KEY ("requisicionRecepcionId") REFERENCES "RequisicionRecepcion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequisicionRecepcionLinea" ADD CONSTRAINT "RequisicionRecepcionLinea_requisicionLineaId_fkey" FOREIGN KEY ("requisicionLineaId") REFERENCES "RequisicionLinea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequisicionRecepcionLinea" ADD CONSTRAINT "RequisicionRecepcionLinea_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_requisicionRecepcionId_fkey" FOREIGN KEY ("requisicionRecepcionId") REFERENCES "RequisicionRecepcion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "ImagenProducto" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "altTexto" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productoId" INTEGER NOT NULL,

    CONSTRAINT "ImagenProducto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImagenProducto_productoId_idx" ON "ImagenProducto"("productoId");

-- AddForeignKey
ALTER TABLE "ImagenProducto" ADD CONSTRAINT "ImagenProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

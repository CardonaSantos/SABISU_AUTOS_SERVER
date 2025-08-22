-- CreateEnum
CREATE TYPE "PedidoPrioridad" AS ENUM ('ALTA', 'BAJA', 'MEDIA');

-- CreateEnum
CREATE TYPE "TipoPedido" AS ENUM ('INTERNO', 'CLIENTE');

-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "prioridad" "PedidoPrioridad" NOT NULL DEFAULT 'MEDIA',
ADD COLUMN     "tipo" "TipoPedido" NOT NULL DEFAULT 'INTERNO';

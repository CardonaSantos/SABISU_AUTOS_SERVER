-- CreateEnum
CREATE TYPE "TipoCuentaBancaria" AS ENUM ('AHORRO', 'CORRIENTE', 'TARJETA');

-- AlterTable
ALTER TABLE "CuentaBancaria" ADD COLUMN     "eliminadoEn" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tipo" "TipoCuentaBancaria" NOT NULL DEFAULT 'CORRIENTE';

/*
  Warnings:

  - You are about to drop the column `comentarios` on the `RegistroCaja` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RegistroCaja" DROP COLUMN "comentarios",
ADD COLUMN     "comentario" TEXT;

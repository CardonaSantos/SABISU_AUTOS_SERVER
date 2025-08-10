/*
  Warnings:

  - You are about to drop the column `productoId` on the `RegistroGarantia` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RegistroGarantia" DROP CONSTRAINT "RegistroGarantia_productoId_fkey";

-- AlterTable
ALTER TABLE "RegistroGarantia" DROP COLUMN "productoId";

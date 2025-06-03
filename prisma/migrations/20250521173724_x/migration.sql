/*
  Warnings:

  - Added the required column `actualizadoEn` to the `StockThreshold` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StockThreshold" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL;

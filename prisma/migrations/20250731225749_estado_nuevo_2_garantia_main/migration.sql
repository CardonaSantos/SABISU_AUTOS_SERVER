/*
  Warnings:

  - The values [ENVIADO_A_PROVEEDOR] on the enum `EstadoGarantia` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoGarantia_new" AS ENUM ('RECIBIDO', 'DIAGNOSTICO', 'ENVIADO_PROVEEDOR', 'EN_REPARACION', 'REPARADO', 'REEMPLAZADO', 'ENTREGADO_CLIENTE', 'CERRADO');
ALTER TABLE "Garantia" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "Garantia" ALTER COLUMN "estado" TYPE "EstadoGarantia_new" USING ("estado"::text::"EstadoGarantia_new");
ALTER TABLE "RegistroGarantia" ALTER COLUMN "estado" TYPE "EstadoGarantia_new" USING ("estado"::text::"EstadoGarantia_new");
ALTER TYPE "EstadoGarantia" RENAME TO "EstadoGarantia_old";
ALTER TYPE "EstadoGarantia_new" RENAME TO "EstadoGarantia";
DROP TYPE "EstadoGarantia_old";
ALTER TABLE "Garantia" ALTER COLUMN "estado" SET DEFAULT 'RECIBIDO';
COMMIT;

/*
  Warnings:

  - The values [COMPLETADO] on the enum `Estado` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Estado_new" AS ENUM ('SOLICITADO', 'EN_ANALISIS', 'EN_DESARROLLO', 'DESPLEGADO');
ALTER TABLE "Requerimiento" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "Requerimiento" ALTER COLUMN "estado" TYPE "Estado_new" USING ("estado"::text::"Estado_new");
ALTER TYPE "Estado" RENAME TO "Estado_old";
ALTER TYPE "Estado_new" RENAME TO "Estado";
DROP TYPE "Estado_old";
ALTER TABLE "Requerimiento" ALTER COLUMN "estado" SET DEFAULT 'SOLICITADO';
COMMIT;

-- AlterTable
ALTER TABLE "Comentario" ADD COLUMN     "codigoSnippet" TEXT,
ADD COLUMN     "lenguaje" TEXT;

-- CreateTable
CREATE TABLE "ModuloAvanzado" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "problemaResuelve" TEXT NOT NULL,
    "sistemasConexos" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModuloAvanzado_pkey" PRIMARY KEY ("id")
);

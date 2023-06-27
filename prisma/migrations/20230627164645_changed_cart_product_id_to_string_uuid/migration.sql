/*
  Warnings:

  - The primary key for the `CartProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CartProduct" DROP CONSTRAINT "CartProduct_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "CartProduct_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CartProduct_id_seq";

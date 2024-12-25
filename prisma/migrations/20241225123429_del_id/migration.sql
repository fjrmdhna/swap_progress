/*
  Warnings:

  - The primary key for the `Site` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Site` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Site_system_key_key";

-- AlterTable
ALTER TABLE "Site" DROP CONSTRAINT "Site_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Site_pkey" PRIMARY KEY ("system_key");

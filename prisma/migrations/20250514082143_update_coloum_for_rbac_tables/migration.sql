/*
  Warnings:

  - The `scope` column on the `Role` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `module` on table `Permission` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ApplicationScope" AS ENUM ('BACKEND', 'CLIENT', 'ALL');

-- AlterTable
ALTER TABLE "Permission" ALTER COLUMN "module" SET NOT NULL;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "scope",
ADD COLUMN     "scope" "ApplicationScope" NOT NULL DEFAULT 'BACKEND';

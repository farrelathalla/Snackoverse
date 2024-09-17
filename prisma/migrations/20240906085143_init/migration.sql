/*
  Warnings:

  - Added the required column `postalCode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Made the column `cityName` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `provinceName` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "cityName" SET NOT NULL,
ALTER COLUMN "provinceName" SET NOT NULL;

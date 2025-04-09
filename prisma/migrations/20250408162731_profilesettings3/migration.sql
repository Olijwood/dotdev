/*
  Warnings:

  - You are about to drop the column `websiteUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "websiteUrl",
ADD COLUMN     "website" VARCHAR(100) DEFAULT '';

/*
  Warnings:

  - You are about to drop the column `order` on the `TestQuestion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TestQuestion" DROP COLUMN "order",
ADD COLUMN     "orderNumber" SERIAL NOT NULL;

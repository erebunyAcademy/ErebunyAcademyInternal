/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber]` on the table `TestQuestion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TestQuestion_orderNumber_key" ON "TestQuestion"("orderNumber");

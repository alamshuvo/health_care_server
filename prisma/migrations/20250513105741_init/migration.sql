/*
  Warnings:

  - A unique constraint covering the columns `[transctionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payments_transctionId_key" ON "payments"("transctionId");

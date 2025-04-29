/*
  Warnings:

  - A unique constraint covering the columns `[appointmentId]` on the table `doctro_schedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "doctro_schedule_appointmentId_key" ON "doctro_schedule"("appointmentId");

-- AddForeignKey
ALTER TABLE "doctro_schedule" ADD CONSTRAINT "doctro_schedule_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

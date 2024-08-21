/*
  Warnings:

  - A unique constraint covering the columns `[courseGroupId,subjectId,scheduleId]` on the table `AcademicRegister` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AttendanceRecord" DROP CONSTRAINT "AttendanceRecord_academicRegisterId_fkey";

-- DropIndex
DROP INDEX "AcademicRegister_courseGroupId_subjectId_key";

-- CreateIndex
CREATE INDEX "AcademicRegister_scheduleId_idx" ON "AcademicRegister"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicRegister_courseGroupId_subjectId_scheduleId_key" ON "AcademicRegister"("courseGroupId", "subjectId", "scheduleId");

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_academicRegisterId_fkey" FOREIGN KEY ("academicRegisterId") REFERENCES "AcademicRegister"("id") ON DELETE CASCADE ON UPDATE CASCADE;

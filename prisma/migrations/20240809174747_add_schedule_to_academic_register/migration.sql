/*
  Warnings:

  - A unique constraint covering the columns `[scheduleId]` on the table `AcademicRegister` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduleId` to the `AcademicRegister` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AcademicRegisterDay" DROP CONSTRAINT "AcademicRegisterDay_academicRegisterId_fkey";

-- DropForeignKey
ALTER TABLE "AcademicRegisterLesson" DROP CONSTRAINT "AcademicRegisterLesson_academicRegisterDayId_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceRecord" DROP CONSTRAINT "AttendanceRecord_academicRegisterId_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceRecord" DROP CONSTRAINT "AttendanceRecord_academicRegisterLessonId_fkey";

-- AlterTable
ALTER TABLE "AcademicRegister" ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AcademicRegister_scheduleId_key" ON "AcademicRegister"("scheduleId");

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_academicRegisterId_fkey" FOREIGN KEY ("academicRegisterId") REFERENCES "AcademicRegister"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_academicRegisterLessonId_fkey" FOREIGN KEY ("academicRegisterLessonId") REFERENCES "AcademicRegisterLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRegister" ADD CONSTRAINT "AcademicRegister_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRegisterDay" ADD CONSTRAINT "AcademicRegisterDay_academicRegisterId_fkey" FOREIGN KEY ("academicRegisterId") REFERENCES "AcademicRegister"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRegisterLesson" ADD CONSTRAINT "AcademicRegisterLesson_academicRegisterDayId_fkey" FOREIGN KEY ("academicRegisterDayId") REFERENCES "AcademicRegisterDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

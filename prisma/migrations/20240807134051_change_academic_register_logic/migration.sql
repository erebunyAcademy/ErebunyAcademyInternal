/*
  Warnings:

  - You are about to drop the column `isAbsent` on the `AttendanceRecord` table. All the data in the column will be lost.
  - You are about to drop the column `lessonOfTheDay` on the `AttendanceRecord` table. All the data in the column will be lost.
  - Added the required column `academicRegisterLessonId` to the `AttendanceRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AttendanceRecord" DROP COLUMN "isAbsent",
DROP COLUMN "lessonOfTheDay",
ADD COLUMN     "academicRegisterLessonId" TEXT NOT NULL,
ADD COLUMN     "isPresent" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "AcademicRegisterDay" (
    "id" TEXT NOT NULL,
    "academicRegisterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "AcademicRegisterDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicRegisterLesson" (
    "id" TEXT NOT NULL,
    "academicRegisterId" TEXT NOT NULL,
    "academicRegisterDayId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "AcademicRegisterLesson_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_academicRegisterLessonId_fkey" FOREIGN KEY ("academicRegisterLessonId") REFERENCES "AcademicRegisterLesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRegisterDay" ADD CONSTRAINT "AcademicRegisterDay_academicRegisterId_fkey" FOREIGN KEY ("academicRegisterId") REFERENCES "AcademicRegister"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRegisterLesson" ADD CONSTRAINT "AcademicRegisterLesson_academicRegisterId_fkey" FOREIGN KEY ("academicRegisterId") REFERENCES "AcademicRegister"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRegisterLesson" ADD CONSTRAINT "AcademicRegisterLesson_academicRegisterDayId_fkey" FOREIGN KEY ("academicRegisterDayId") REFERENCES "AcademicRegisterDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[lessonOfTheDay,academicRegisterDayId]` on the table `AcademicRegisterLesson` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `lessonOfTheDay` on the `AcademicRegisterLesson` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AcademicRegisterLesson" DROP COLUMN "lessonOfTheDay",
ADD COLUMN     "lessonOfTheDay" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AcademicRegisterLesson_lessonOfTheDay_academicRegisterDayId_key" ON "AcademicRegisterLesson"("lessonOfTheDay", "academicRegisterDayId");

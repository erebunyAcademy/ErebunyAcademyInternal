/*
  Warnings:

  - Added the required column `lessonOfTheDay` to the `AcademicRegisterLesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AcademicRegisterLesson" ADD COLUMN     "lessonOfTheDay" TEXT NOT NULL;

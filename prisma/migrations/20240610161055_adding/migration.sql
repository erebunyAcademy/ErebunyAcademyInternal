/*
  Warnings:

  - Made the column `duration` on table `Exam` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Exam" ALTER COLUMN "duration" SET NOT NULL;

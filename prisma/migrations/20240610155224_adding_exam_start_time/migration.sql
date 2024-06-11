/*
  Warnings:

  - Added the required column `examStartTime` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "examStartTime" TIMESTAMP(0) NOT NULL;

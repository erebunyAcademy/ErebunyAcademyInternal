/*
  Warnings:

  - You are about to drop the column `enabled` on the `Exam` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ExamStatusEnum" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "enabled",
ADD COLUMN     "status" "ExamStatusEnum" NOT NULL DEFAULT 'NOT_STARTED';

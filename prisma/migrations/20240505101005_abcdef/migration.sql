/*
  Warnings:

  - The `confirmationCode` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `TestExam` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `skillLevel` to the `TestQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TestQuestionLevelEnum" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- DropForeignKey
ALTER TABLE "TestExam" DROP CONSTRAINT "TestExam_examId_fkey";

-- AlterTable
ALTER TABLE "TestQuestion" ADD COLUMN     "examId" TEXT,
ADD COLUMN     "skillLevel" "TestQuestionLevelEnum" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "confirmationCode",
ADD COLUMN     "confirmationCode" INTEGER;

-- DropTable
DROP TABLE "TestExam";

-- CreateTable
CREATE TABLE "StudentExam" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(0) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentExam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentExam_examId_studentId_key" ON "StudentExam"("examId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_confirmationCode_key" ON "User"("confirmationCode");

-- AddForeignKey
ALTER TABLE "StudentExam" ADD CONSTRAINT "StudentExam_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentExam" ADD CONSTRAINT "StudentExam_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestion" ADD CONSTRAINT "TestQuestion_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

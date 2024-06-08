/*
  Warnings:

  - A unique constraint covering the columns `[optionId,studentExamId,testQuestionId]` on the table `StudentAnswerOption` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `testQuestionId` to the `StudentAnswerOption` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "StudentAnswerOption_optionId_studentExamId_key";

-- AlterTable
ALTER TABLE "StudentAnswerOption" ADD COLUMN     "testQuestionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StudentAnswerOption_optionId_studentExamId_testQuestionId_key" ON "StudentAnswerOption"("optionId", "studentExamId", "testQuestionId");

-- AddForeignKey
ALTER TABLE "StudentAnswerOption" ADD CONSTRAINT "StudentAnswerOption_testQuestionId_fkey" FOREIGN KEY ("testQuestionId") REFERENCES "TestQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

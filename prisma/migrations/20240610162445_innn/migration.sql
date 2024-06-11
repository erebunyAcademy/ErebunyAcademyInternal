-- DropForeignKey
ALTER TABLE "StudentAnswerOption" DROP CONSTRAINT "StudentAnswerOption_studentExamId_fkey";

-- AlterTable
ALTER TABLE "StudentExam" ADD COLUMN     "hasFinished" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "StudentAnswerOption" ADD CONSTRAINT "StudentAnswerOption_studentExamId_fkey" FOREIGN KEY ("studentExamId") REFERENCES "StudentExam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

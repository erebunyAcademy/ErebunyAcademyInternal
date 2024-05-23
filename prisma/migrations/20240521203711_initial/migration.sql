-- DropForeignKey
ALTER TABLE "ExamTranslation" DROP CONSTRAINT "ExamTranslation_examId_fkey";

-- AddForeignKey
ALTER TABLE "ExamTranslation" ADD CONSTRAINT "ExamTranslation_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

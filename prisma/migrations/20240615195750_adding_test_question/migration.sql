-- CreateTable
CREATE TABLE "ExamTranslationTests" (
    "id" TEXT NOT NULL,
    "testQuestionId" TEXT NOT NULL,
    "examTranslationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ExamTranslationTests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamTranslationTests_testQuestionId_examTranslationId_key" ON "ExamTranslationTests"("testQuestionId", "examTranslationId");

-- AddForeignKey
ALTER TABLE "ExamTranslationTests" ADD CONSTRAINT "ExamTranslationTests_testQuestionId_fkey" FOREIGN KEY ("testQuestionId") REFERENCES "TestQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamTranslationTests" ADD CONSTRAINT "ExamTranslationTests_examTranslationId_fkey" FOREIGN KEY ("examTranslationId") REFERENCES "ExamTranslation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

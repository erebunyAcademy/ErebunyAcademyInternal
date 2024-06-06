-- AlterTable
ALTER TABLE "StudentExam" ADD COLUMN     "hasOpened" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "studentUuid" TEXT;

/*
  Warnings:

  - You are about to drop the `CourseSubject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseSubject" DROP CONSTRAINT "CourseSubject_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseSubject" DROP CONSTRAINT "CourseSubject_subjectId_fkey";

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "courseId" TEXT;

-- DropTable
DROP TABLE "CourseSubject";

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

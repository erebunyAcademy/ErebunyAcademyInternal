-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "courseGroupId" TEXT,
ADD COLUMN     "courseId" TEXT,
ADD COLUMN     "facultyId" TEXT;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_courseGroupId_fkey" FOREIGN KEY ("courseGroupId") REFERENCES "CourseGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

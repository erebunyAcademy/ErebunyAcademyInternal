-- DropForeignKey
ALTER TABLE "AcademicRegisterLesson" DROP CONSTRAINT "AcademicRegisterLesson_academicRegisterId_fkey";

-- AddForeignKey
ALTER TABLE "AcademicRegisterLesson" ADD CONSTRAINT "AcademicRegisterLesson_academicRegisterId_fkey" FOREIGN KEY ("academicRegisterId") REFERENCES "AcademicRegister"("id") ON DELETE CASCADE ON UPDATE CASCADE;

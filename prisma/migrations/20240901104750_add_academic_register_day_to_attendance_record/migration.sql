-- AlterTable
ALTER TABLE "AttendanceRecord" ADD COLUMN     "academicRegisterDayId" TEXT;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_academicRegisterDayId_fkey" FOREIGN KEY ("academicRegisterDayId") REFERENCES "AcademicRegisterDay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

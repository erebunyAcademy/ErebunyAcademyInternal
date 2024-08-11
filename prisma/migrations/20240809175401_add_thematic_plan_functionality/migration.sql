-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_courseGroupId_fkey";

-- AlterTable
ALTER TABLE "ThematicPlan" ADD COLUMN     "academicRegisterId" TEXT,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_courseGroupId_fkey" FOREIGN KEY ("courseGroupId") REFERENCES "CourseGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThematicPlan" ADD CONSTRAINT "ThematicPlan_academicRegisterId_fkey" FOREIGN KEY ("academicRegisterId") REFERENCES "AcademicRegister"("id") ON DELETE SET NULL ON UPDATE CASCADE;

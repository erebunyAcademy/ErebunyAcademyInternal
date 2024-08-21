/*
  Warnings:

  - You are about to drop the column `courseId` on the `AcademicRegister` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `AttendanceRecord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[courseGroupId,subjectId]` on the table `AcademicRegister` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseGroupId` to the `AcademicRegister` table without a default value. This is not possible if the table is not empty.
  - Made the column `subjectId` on table `AcademicRegister` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `lessonOfTheDay` to the `AttendanceRecord` table without a default value. This is not possible if the table is not empty.
  - Made the column `subjectId` on table `AttendanceRecord` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AcademicRegister" DROP CONSTRAINT "AcademicRegister_courseId_fkey";

-- DropForeignKey
ALTER TABLE "AcademicRegister" DROP CONSTRAINT "AcademicRegister_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceRecord" DROP CONSTRAINT "AttendanceRecord_subjectId_fkey";

-- AlterTable
ALTER TABLE "AcademicRegister" DROP COLUMN "courseId",
ADD COLUMN     "courseGroupId" TEXT NOT NULL,
ALTER COLUMN "subjectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "AttendanceRecord" DROP COLUMN "date",
ADD COLUMN     "lessonOfTheDay" TEXT NOT NULL,
ALTER COLUMN "subjectId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AcademicRegister_courseGroupId_subjectId_key" ON "AcademicRegister"("courseGroupId", "subjectId");

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRegister" ADD CONSTRAINT "AcademicRegister_courseGroupId_fkey" FOREIGN KEY ("courseGroupId") REFERENCES "CourseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRegister" ADD CONSTRAINT "AcademicRegister_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

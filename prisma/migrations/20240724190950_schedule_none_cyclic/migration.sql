/*
  Warnings:

  - You are about to drop the `CourseSubject` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ScheduleTypeEnum" AS ENUM ('CYCLIC', 'NON_CYCLIC');

-- CreateEnum
CREATE TYPE "ThematicSubPlanTypeEnum" AS ENUM ('THEORETICAL', 'PRACTICAL');

-- CreateEnum
CREATE TYPE "ScheduleExamTypeEnum" AS ENUM ('THEORETICAL', 'VERBAL', 'ASSESSMENT');

-- CreateEnum
CREATE TYPE "WeekDayEnum" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "CourseSubject" DROP CONSTRAINT "CourseSubject_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseSubject" DROP CONSTRAINT "CourseSubject_subjectId_fkey";

-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "nonCyclicScheduleId" TEXT,
ADD COLUMN     "scheduleId" TEXT,
ALTER COLUMN "mimetype" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "courseId" TEXT;

-- DropTable
DROP TABLE "CourseSubject";

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "examType" "ScheduleExamTypeEnum" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "totalHours" DOUBLE PRECISION NOT NULL,
    "startDayDate" TIMESTAMP(3) NOT NULL,
    "endDayDate" TIMESTAMP(3) NOT NULL,
    "isAssessment" BOOLEAN NOT NULL DEFAULT false,
    "examDate" TIMESTAMP(3) NOT NULL,
    "links" JSONB NOT NULL,
    "subjectId" TEXT NOT NULL,
    "courseGroupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NonCyclicSchedule" (
    "id" TEXT NOT NULL,
    "availableDay" "WeekDayEnum" NOT NULL,
    "period" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "totalHours" DOUBLE PRECISION NOT NULL,
    "courseGroupId" TEXT NOT NULL,
    "links" JSONB NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "examType" "ScheduleExamTypeEnum" NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "NonCyclicSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleTeacher" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "scheduleId" TEXT,
    "nonCyclicScheduleId" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ScheduleTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThematicPlan" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "totalHours" DOUBLE PRECISION NOT NULL,
    "scheduleId" TEXT,
    "type" "ThematicSubPlanTypeEnum" NOT NULL,
    "nonCyclicScheduleId" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ThematicPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThematicPlanDescription" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "thematicPlanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ThematicPlanDescription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_courseGroupId_fkey" FOREIGN KEY ("courseGroupId") REFERENCES "CourseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonCyclicSchedule" ADD CONSTRAINT "NonCyclicSchedule_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonCyclicSchedule" ADD CONSTRAINT "NonCyclicSchedule_courseGroupId_fkey" FOREIGN KEY ("courseGroupId") REFERENCES "CourseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTeacher" ADD CONSTRAINT "ScheduleTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTeacher" ADD CONSTRAINT "ScheduleTeacher_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTeacher" ADD CONSTRAINT "ScheduleTeacher_nonCyclicScheduleId_fkey" FOREIGN KEY ("nonCyclicScheduleId") REFERENCES "NonCyclicSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThematicPlan" ADD CONSTRAINT "ThematicPlan_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThematicPlan" ADD CONSTRAINT "ThematicPlan_nonCyclicScheduleId_fkey" FOREIGN KEY ("nonCyclicScheduleId") REFERENCES "NonCyclicSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThematicPlanDescription" ADD CONSTRAINT "ThematicPlanDescription_thematicPlanId_fkey" FOREIGN KEY ("thematicPlanId") REFERENCES "ThematicPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_nonCyclicScheduleId_fkey" FOREIGN KEY ("nonCyclicScheduleId") REFERENCES "NonCyclicSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

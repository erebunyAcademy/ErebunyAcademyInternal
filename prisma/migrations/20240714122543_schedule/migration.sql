-- CreateEnum
CREATE TYPE "ThematicSubPlanTypeEnum" AS ENUM ('THEORETICAL', 'PRACTICAL');

-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "scheduleId" TEXT;

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "totalHours" DOUBLE PRECISION NOT NULL,
    "startDayDate" TIMESTAMP(3) NOT NULL,
    "endDayDate" TIMESTAMP(3) NOT NULL,
    "isAssessment" BOOLEAN NOT NULL DEFAULT false,
    "examDate" TIMESTAMP(3) NOT NULL,
    "subjectId" TEXT NOT NULL,
    "links" JSONB NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleTeacher" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "scheduleId" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ScheduleTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThematicPlan" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "totalHours" DOUBLE PRECISION NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "type" "ThematicSubPlanTypeEnum" NOT NULL,
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
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTeacher" ADD CONSTRAINT "ScheduleTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTeacher" ADD CONSTRAINT "ScheduleTeacher_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThematicPlan" ADD CONSTRAINT "ThematicPlan_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThematicPlanDescription" ADD CONSTRAINT "ThematicPlanDescription_thematicPlanId_fkey" FOREIGN KEY ("thematicPlanId") REFERENCES "ThematicPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

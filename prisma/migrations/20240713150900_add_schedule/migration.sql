-- CreateEnum
CREATE TYPE "ThematicSubPlanTypeEnum" AS ENUM ('THEORETICAL', 'PRACTICAL');

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL,
    "startDayDate" TIMESTAMP(3) NOT NULL,
    "endDayDate" TIMESTAMP(3) NOT NULL,
    "isAssessment" BOOLEAN NOT NULL DEFAULT false,
    "exam" TIMESTAMP(3) NOT NULL,
    "thematicPlanId" TEXT NOT NULL,
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
    "totalHours" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ThematicPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThematicSubPlan" (
    "id" TEXT NOT NULL,
    "totalHours" DOUBLE PRECISION NOT NULL,
    "thematicPlanId" TEXT,
    "type" "ThematicSubPlanTypeEnum" NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ThematicSubPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThematicPlanDescription" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "thematicSubPlanId" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ThematicPlanDescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleTeacher_teacherId_subjectId_key" ON "ScheduleTeacher"("teacherId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "ThematicSubPlan_thematicPlanId_type_key" ON "ThematicSubPlan"("thematicPlanId", "type");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_thematicPlanId_fkey" FOREIGN KEY ("thematicPlanId") REFERENCES "ThematicPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTeacher" ADD CONSTRAINT "ScheduleTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTeacher" ADD CONSTRAINT "ScheduleTeacher_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThematicSubPlan" ADD CONSTRAINT "ThematicSubPlan_thematicPlanId_fkey" FOREIGN KEY ("thematicPlanId") REFERENCES "ThematicPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThematicPlanDescription" ADD CONSTRAINT "ThematicPlanDescription_thematicSubPlanId_fkey" FOREIGN KEY ("thematicSubPlanId") REFERENCES "ThematicSubPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleTeacher" DROP CONSTRAINT "ScheduleTeacher_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleTeacher" DROP CONSTRAINT "ScheduleTeacher_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "ThematicPlan" DROP CONSTRAINT "ThematicPlan_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "ThematicPlanDescription" DROP CONSTRAINT "ThematicPlanDescription_thematicPlanId_fkey";

-- AddForeignKey
ALTER TABLE "ScheduleTeacher" ADD CONSTRAINT "ScheduleTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTeacher" ADD CONSTRAINT "ScheduleTeacher_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThematicPlan" ADD CONSTRAINT "ThematicPlan_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThematicPlanDescription" ADD CONSTRAINT "ThematicPlanDescription_thematicPlanId_fkey" FOREIGN KEY ("thematicPlanId") REFERENCES "ThematicPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleTime" DROP CONSTRAINT "ScheduleTime_scheduleId_fkey";

-- AddForeignKey
ALTER TABLE "ScheduleTime" ADD CONSTRAINT "ScheduleTime_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

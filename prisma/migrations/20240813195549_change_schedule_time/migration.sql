/*
  Warnings:

  - You are about to drop the column `availableDay` on the `ScheduleTime` table. All the data in the column will be lost.
  - You are about to drop the column `period` on the `ScheduleTime` table. All the data in the column will be lost.
  - Added the required column `dayOfWeek` to the `ScheduleTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonOfTheDay` to the `ScheduleTime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScheduleTime" DROP COLUMN "availableDay",
DROP COLUMN "period",
ADD COLUMN     "dayOfWeek" "WeekDayEnum" NOT NULL,
ADD COLUMN     "lessonOfTheDay" INTEGER NOT NULL;

/*
  Warnings:

  - You are about to drop the column `nonCyclicScheduleId` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `nonCyclicScheduleId` on the `ScheduleTeacher` table. All the data in the column will be lost.
  - You are about to drop the column `nonCyclicScheduleId` on the `ScheduleTime` table. All the data in the column will be lost.
  - You are about to drop the column `nonCyclicScheduleId` on the `ThematicPlan` table. All the data in the column will be lost.
  - You are about to drop the `NonCyclicSchedule` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `scheduleId` to the `ScheduleTime` table without a default value. This is not possible if the table is not empty.
  - Made the column `scheduleId` on table `ThematicPlan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_nonCyclicScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "NonCyclicSchedule" DROP CONSTRAINT "NonCyclicSchedule_courseGroupId_fkey";

-- DropForeignKey
ALTER TABLE "NonCyclicSchedule" DROP CONSTRAINT "NonCyclicSchedule_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleTeacher" DROP CONSTRAINT "ScheduleTeacher_nonCyclicScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleTime" DROP CONSTRAINT "ScheduleTime_nonCyclicScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "ThematicPlan" DROP CONSTRAINT "ThematicPlan_nonCyclicScheduleId_fkey";

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "nonCyclicScheduleId";

-- AlterTable
ALTER TABLE "ScheduleTeacher" DROP COLUMN "nonCyclicScheduleId";

-- AlterTable
ALTER TABLE "ScheduleTime" DROP COLUMN "nonCyclicScheduleId",
ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ThematicPlan" DROP COLUMN "nonCyclicScheduleId",
ALTER COLUMN "scheduleId" SET NOT NULL;

-- DropTable
DROP TABLE "NonCyclicSchedule";

-- AddForeignKey
ALTER TABLE "ScheduleTime" ADD CONSTRAINT "ScheduleTime_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

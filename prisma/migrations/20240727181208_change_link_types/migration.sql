/*
  Warnings:

  - The `links` column on the `NonCyclicSchedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `links` column on the `Schedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "ThematicPlan" DROP CONSTRAINT "ThematicPlan_nonCyclicScheduleId_fkey";

-- AlterTable
ALTER TABLE "NonCyclicSchedule" DROP COLUMN "links",
ADD COLUMN     "links" TEXT[];

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "links",
ADD COLUMN     "links" TEXT[];

-- AddForeignKey
ALTER TABLE "ThematicPlan" ADD CONSTRAINT "ThematicPlan_nonCyclicScheduleId_fkey" FOREIGN KEY ("nonCyclicScheduleId") REFERENCES "NonCyclicSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Made the column `courseId` on table `CourseGroup` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CourseGroup" ALTER COLUMN "courseId" SET NOT NULL;

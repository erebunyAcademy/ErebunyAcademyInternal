/*
  Warnings:

  - You are about to drop the column `gradeLevelId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `gradeLevelId` on the `CourseGroup` table. All the data in the column will be lost.
  - You are about to drop the `GradeLevel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_gradeLevelId_fkey";

-- DropForeignKey
ALTER TABLE "CourseGroup" DROP CONSTRAINT "CourseGroup_gradeLevelId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "gradeLevelId";

-- AlterTable
ALTER TABLE "CourseGroup" DROP COLUMN "gradeLevelId";

-- DropTable
DROP TABLE "GradeLevel";

-- DropEnum
DROP TYPE "GradeLevelTypeEnum";

-- CreateEnum
CREATE TYPE "GradeLevelTypeEnum" AS ENUM ('COURSE', 'COURSE_GROUP');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "gradeLevelId" TEXT;

-- AlterTable
ALTER TABLE "CourseGroup" ADD COLUMN     "gradeLevelId" TEXT;

-- CreateTable
CREATE TABLE "GradeLevel" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "type" "GradeLevelTypeEnum" NOT NULL DEFAULT 'COURSE',
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "GradeLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GradeLevel_level_type_key" ON "GradeLevel"("level", "type");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "GradeLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseGroup" ADD CONSTRAINT "CourseGroup_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "GradeLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

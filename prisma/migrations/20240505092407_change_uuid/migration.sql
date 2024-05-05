/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Attachment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Exam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Faculty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Option` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Schedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ScheduleSubject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `StudentGrade` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `StudentGradeGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `StudentGradeSubject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SubjectTeacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Teacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TestExam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TestQuestion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `title` on table `Exam` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_testQuestionId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleSubject" DROP CONSTRAINT "ScheduleSubject_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleSubject" DROP CONSTRAINT "ScheduleSubject_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_studentGradeGroupId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_studentGradeId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudentGrade" DROP CONSTRAINT "StudentGrade_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "StudentGradeGroup" DROP CONSTRAINT "StudentGradeGroup_studentGradeId_fkey";

-- DropForeignKey
ALTER TABLE "StudentGradeSubject" DROP CONSTRAINT "StudentGradeSubject_studentGradeId_fkey";

-- DropForeignKey
ALTER TABLE "StudentGradeSubject" DROP CONSTRAINT "StudentGradeSubject_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectTeacher" DROP CONSTRAINT "SubjectTeacher_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectTeacher" DROP CONSTRAINT "SubjectTeacher_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_userId_fkey";

-- DropForeignKey
ALTER TABLE "TestExam" DROP CONSTRAINT "TestExam_examId_fkey";

-- DropForeignKey
ALTER TABLE "_ScheduleToTeacher" DROP CONSTRAINT "_ScheduleToTeacher_A_fkey";

-- DropForeignKey
ALTER TABLE "_ScheduleToTeacher" DROP CONSTRAINT "_ScheduleToTeacher_B_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Admin_id_seq";

-- AlterTable
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "subjectId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Attachment_id_seq";

-- AlterTable
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "title" SET NOT NULL,
ADD CONSTRAINT "Exam_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Exam_id_seq";

-- AlterTable
ALTER TABLE "Faculty" DROP CONSTRAINT "Faculty_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Faculty_id_seq";

-- AlterTable
ALTER TABLE "Option" DROP CONSTRAINT "Option_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "testQuestionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Option_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Option_id_seq";

-- AlterTable
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Schedule_id_seq";

-- AlterTable
ALTER TABLE "ScheduleSubject" DROP CONSTRAINT "ScheduleSubject_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "scheduleId" SET DATA TYPE TEXT,
ALTER COLUMN "subjectId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ScheduleSubject_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ScheduleSubject_id_seq";

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "studentGradeId" SET DATA TYPE TEXT,
ALTER COLUMN "facultyId" SET DATA TYPE TEXT,
ALTER COLUMN "studentGradeGroupId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Student_id_seq";

-- AlterTable
ALTER TABLE "StudentGrade" DROP CONSTRAINT "StudentGrade_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "facultyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "StudentGrade_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StudentGrade_id_seq";

-- AlterTable
ALTER TABLE "StudentGradeGroup" DROP CONSTRAINT "StudentGradeGroup_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "studentGradeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "StudentGradeGroup_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StudentGradeGroup_id_seq";

-- AlterTable
ALTER TABLE "StudentGradeSubject" DROP CONSTRAINT "StudentGradeSubject_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "studentGradeId" SET DATA TYPE TEXT,
ALTER COLUMN "subjectId" SET DATA TYPE TEXT,
ADD CONSTRAINT "StudentGradeSubject_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StudentGradeSubject_id_seq";

-- AlterTable
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Subject_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Subject_id_seq";

-- AlterTable
ALTER TABLE "SubjectTeacher" DROP CONSTRAINT "SubjectTeacher_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "teacherId" SET DATA TYPE TEXT,
ALTER COLUMN "subjectId" SET DATA TYPE TEXT,
ADD CONSTRAINT "SubjectTeacher_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SubjectTeacher_id_seq";

-- AlterTable
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Teacher_id_seq";

-- AlterTable
ALTER TABLE "TestExam" DROP CONSTRAINT "TestExam_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "testId" SET DATA TYPE TEXT,
ALTER COLUMN "examId" SET DATA TYPE TEXT,
ADD CONSTRAINT "TestExam_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TestExam_id_seq";

-- AlterTable
ALTER TABLE "TestQuestion" DROP CONSTRAINT "TestQuestion_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TestQuestion_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TestQuestion_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "confirmationCode" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "_ScheduleToTeacher" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSubject" ADD CONSTRAINT "ScheduleSubject_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSubject" ADD CONSTRAINT "ScheduleSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_studentGradeId_fkey" FOREIGN KEY ("studentGradeId") REFERENCES "StudentGrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_studentGradeGroupId_fkey" FOREIGN KEY ("studentGradeGroupId") REFERENCES "StudentGradeGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGradeSubject" ADD CONSTRAINT "StudentGradeSubject_studentGradeId_fkey" FOREIGN KEY ("studentGradeId") REFERENCES "StudentGrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGradeSubject" ADD CONSTRAINT "StudentGradeSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGrade" ADD CONSTRAINT "StudentGrade_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGradeGroup" ADD CONSTRAINT "StudentGradeGroup_studentGradeId_fkey" FOREIGN KEY ("studentGradeId") REFERENCES "StudentGrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestExam" ADD CONSTRAINT "TestExam_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_testQuestionId_fkey" FOREIGN KEY ("testQuestionId") REFERENCES "TestQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScheduleToTeacher" ADD CONSTRAINT "_ScheduleToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScheduleToTeacher" ADD CONSTRAINT "_ScheduleToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

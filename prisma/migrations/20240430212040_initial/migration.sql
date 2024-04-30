-- CreateEnum
CREATE TYPE "UserRoleEnum" AS ENUM ('STUDENT', 'TEACHER');

-- CreateEnum
CREATE TYPE "ExamTypeEnum" AS ENUM ('VERBAL', 'TEST');

-- CreateEnum
CREATE TYPE "TestQuestionTypeEnum" AS ENUM ('RADIO', 'INPUT', 'CHECKBOX');

-- CreateEnum
CREATE TYPE "AttachmentTypeEnum" AS ENUM ('AVATAR', 'FILE');

-- CreateEnum
CREATE TYPE "AdminRolesEnum" AS ENUM ('SYS_ADMIN', 'RECTORAT', 'ACCOUNTANT', 'OPERATOR', 'HEAD_OF_DEPARTMENT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" VARCHAR(45),
    "lastName" VARCHAR(45),
    "password" VARCHAR(60) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isAdminVerified" BOOLEAN NOT NULL DEFAULT false,
    "phone" VARCHAR(60),
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "address" VARCHAR(60),
    "country" VARCHAR(60),
    "state" VARCHAR(60),
    "city" VARCHAR(60),
    "confirmationCode" INTEGER,
    "role" "UserRoleEnum" NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "profession" VARCHAR(60) NOT NULL,
    "workPlace" VARCHAR(60) NOT NULL,
    "scientificActivity" VARCHAR(60),
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(60),
    "description" TEXT,
    "academicYear" VARCHAR(60),
    "place" VARCHAR(60),
    "teacherId" INTEGER NOT NULL,
    "classDurationHour" DOUBLE PRECISION NOT NULL,
    "examType" "ExamTypeEnum" NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleSubject" (
    "id" SERIAL NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ScheduleSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "studentGradeId" INTEGER NOT NULL,
    "facultyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseGroupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(60),
    "description" VARCHAR(60),
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentGradeSubject" (
    "id" SERIAL NOT NULL,
    "studentGradeId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "StudentGradeSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentGrade" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(60),
    "description" VARCHAR(60),
    "facultyId" INTEGER,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "StudentGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentGradeGroup" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(60),
    "description" VARCHAR(60),
    "studentGradeId" INTEGER,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "StudentGradeGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(60),
    "description" VARCHAR(60),
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectTeacher" (
    "id" SERIAL NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "SubjectTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(60),
    "description" VARCHAR(60),
    "key" VARCHAR(60) NOT NULL,
    "subjectId" INTEGER,
    "mimetype" VARCHAR(60) NOT NULL,
    "userId" INTEGER,
    "type" "AttachmentTypeEnum" NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(60) NOT NULL,
    "description" VARCHAR(60),
    "updatedAt" TIMESTAMP(0) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestExam" (
    "id" SERIAL NOT NULL,
    "testId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "TestExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestQuestion" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(60) NOT NULL,
    "description" VARCHAR(60),
    "type" "TestQuestionTypeEnum" NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "TestQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(60) NOT NULL,
    "isRightAnswer" BOOLEAN NOT NULL DEFAULT false,
    "testQuestionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ScheduleToTeacher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_confirmationCode_key" ON "User"("confirmationCode");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleSubject_scheduleId_subjectId_key" ON "ScheduleSubject"("scheduleId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentGradeSubject_studentGradeId_subjectId_key" ON "StudentGradeSubject"("studentGradeId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectTeacher_teacherId_subjectId_key" ON "SubjectTeacher"("teacherId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "TestExam_testId_examId_key" ON "TestExam"("testId", "examId");

-- CreateIndex
CREATE UNIQUE INDEX "_ScheduleToTeacher_AB_unique" ON "_ScheduleToTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_ScheduleToTeacher_B_index" ON "_ScheduleToTeacher"("B");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSubject" ADD CONSTRAINT "ScheduleSubject_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSubject" ADD CONSTRAINT "ScheduleSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_studentGradeId_fkey" FOREIGN KEY ("studentGradeId") REFERENCES "StudentGrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_courseGroupId_fkey" FOREIGN KEY ("courseGroupId") REFERENCES "StudentGradeGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestExam" ADD CONSTRAINT "TestExam_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_testQuestionId_fkey" FOREIGN KEY ("testQuestionId") REFERENCES "TestQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScheduleToTeacher" ADD CONSTRAINT "_ScheduleToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScheduleToTeacher" ADD CONSTRAINT "_ScheduleToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

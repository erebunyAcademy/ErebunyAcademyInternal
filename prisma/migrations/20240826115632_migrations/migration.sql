-- CreateEnum
CREATE TYPE "UserRoleEnum" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "LanguageTypeEnum" AS ENUM ('AM', 'RU', 'EN');

-- CreateEnum
CREATE TYPE "ExamStatusEnum" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TestQuestionLevelEnum" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "ExamTypeEnum" AS ENUM ('VERBAL', 'TEST');

-- CreateEnum
CREATE TYPE "ScheduleTypeEnum" AS ENUM ('CYCLIC', 'NON_CYCLIC');

-- CreateEnum
CREATE TYPE "TestQuestionTypeEnum" AS ENUM ('RADIO', 'CHECKBOX');

-- CreateEnum
CREATE TYPE "AttachmentTypeEnum" AS ENUM ('AVATAR', 'FILE');

-- CreateEnum
CREATE TYPE "ThematicSubPlanTypeEnum" AS ENUM ('THEORETICAL', 'PRACTICAL');

-- CreateEnum
CREATE TYPE "ScheduleExamTypeEnum" AS ENUM ('THEORETICAL', 'VERBAL', 'ASSESSMENT');

-- CreateEnum
CREATE TYPE "AdminRoleEnum" AS ENUM ('SYS_ADMIN', 'RECTORAT', 'ACCOUNTANT', 'OPERATOR', 'HEAD_OF_DEPARTMENT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "uniqueUserId" INTEGER NOT NULL,
    "firstName" VARCHAR(45) NOT NULL,
    "lastName" VARCHAR(45) NOT NULL,
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
    "attachmentId" TEXT,
    "role" "UserRoleEnum" NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "profession" VARCHAR(60) NOT NULL,
    "workPlace" VARCHAR(60) NOT NULL,
    "scientificActivity" VARCHAR(60),
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "AdminRoleEnum" NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "courseGroupId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "academicRegisterId" TEXT NOT NULL,
    "mark" INTEGER,
    "isPresent" BOOLEAN NOT NULL DEFAULT true,
    "subjectId" TEXT NOT NULL,
    "academicRegisterLessonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(60) NOT NULL,
    "description" VARCHAR(60),
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(60) NOT NULL,
    "description" VARCHAR(60),
    "facultyId" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseGroup" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(60) NOT NULL,
    "description" VARCHAR(60),
    "courseId" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "CourseGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(60) NOT NULL,
    "description" VARCHAR(60),
    "courseId" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "totalHours" DOUBLE PRECISION NOT NULL,
    "startDayDate" TIMESTAMP(3),
    "endDayDate" TIMESTAMP(3),
    "examDate" TIMESTAMP(3),
    "links" TEXT[],
    "academicYear" TEXT NOT NULL,
    "courseGroupId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "examType" "ScheduleExamTypeEnum" NOT NULL,
    "type" "ScheduleTypeEnum" NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleTime" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "lessonOfTheDay" INTEGER NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ScheduleTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleTeacher" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "scheduleId" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ScheduleTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThematicPlan" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "totalHours" DOUBLE PRECISION NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "academicRegisterId" TEXT,
    "type" "ThematicSubPlanTypeEnum" NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ThematicPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThematicPlanDescription" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "thematicPlanId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ThematicPlanDescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectTeacher" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "SubjectTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" VARCHAR(60),
    "key" TEXT NOT NULL,
    "subjectId" TEXT,
    "mimetype" TEXT NOT NULL,
    "userId" TEXT,
    "type" "AttachmentTypeEnum" NOT NULL,
    "scheduleId" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentExam" (
    "id" TEXT NOT NULL,
    "hasOpened" BOOLEAN NOT NULL DEFAULT false,
    "hasFinished" BOOLEAN NOT NULL DEFAULT false,
    "examId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentUuid" TEXT,
    "studentExamResult" TEXT,
    "updatedAt" TIMESTAMP(0) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAnswerOption" (
    "id" TEXT NOT NULL,
    "studentExamId" TEXT NOT NULL,
    "optionId" TEXT,
    "testQuestionId" TEXT NOT NULL,

    CONSTRAINT "StudentAnswerOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "facultyId" TEXT,
    "courseId" TEXT,
    "courseGroupId" TEXT,
    "duration" DOUBLE PRECISION NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "status" "ExamStatusEnum" NOT NULL DEFAULT 'NOT_STARTED',
    "examStartTime" TIMESTAMP(0),
    "updatedAt" TIMESTAMP(0) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamTranslation" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(60) NOT NULL,
    "description" TEXT,
    "examId" TEXT NOT NULL,
    "language" "LanguageTypeEnum" NOT NULL,
    "updatedAt" TIMESTAMP(0) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestQuestion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "TestQuestionTypeEnum" NOT NULL,
    "skillLevel" "TestQuestionLevelEnum" NOT NULL,
    "examTranslationId" TEXT,
    "language" "LanguageTypeEnum",
    "subjectId" TEXT,
    "category" TEXT,
    "topic" TEXT,
    "subTopic" TEXT,
    "orderNumber" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "TestQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamTranslationTests" (
    "id" TEXT NOT NULL,
    "testQuestionId" TEXT NOT NULL,
    "examTranslationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ExamTranslationTests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isRightAnswer" BOOLEAN NOT NULL DEFAULT false,
    "testQuestionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicRegister" (
    "id" TEXT NOT NULL,
    "courseGroupId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "AcademicRegister_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicRegisterDay" (
    "id" TEXT NOT NULL,
    "academicRegisterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "AcademicRegisterDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicRegisterLesson" (
    "id" TEXT NOT NULL,
    "academicRegisterId" TEXT NOT NULL,
    "academicRegisterDayId" TEXT NOT NULL,
    "lessonOfTheDay" INTEGER NOT NULL,
    "isCompletedLesson" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "AcademicRegisterLesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_uniqueUserId_key" ON "User"("uniqueUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_confirmationCode_key" ON "User"("confirmationCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_attachmentId_key" ON "User"("attachmentId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectTeacher_teacherId_subjectId_key" ON "SubjectTeacher"("teacherId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentExam_examId_studentId_key" ON "StudentExam"("examId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAnswerOption_optionId_studentExamId_testQuestionId_key" ON "StudentAnswerOption"("optionId", "studentExamId", "testQuestionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamTranslation_examId_language_key" ON "ExamTranslation"("examId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "TestQuestion_orderNumber_key" ON "TestQuestion"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ExamTranslationTests_testQuestionId_examTranslationId_key" ON "ExamTranslationTests"("testQuestionId", "examTranslationId");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicRegister_scheduleId_key" ON "AcademicRegister"("scheduleId");

-- CreateIndex
CREATE INDEX "AcademicRegister_scheduleId_idx" ON "AcademicRegister"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicRegister_courseGroupId_subjectId_scheduleId_key" ON "AcademicRegister"("courseGroupId", "subjectId", "scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicRegisterLesson_lessonOfTheDay_academicRegisterDayId_key" ON "AcademicRegisterLesson"("lessonOfTheDay", "academicRegisterDayId");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_courseGroupId_fkey" FOREIGN KEY ("courseGroupId") REFERENCES "CourseGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_academicRegisterId_fkey" FOREIGN KEY ("academicRegisterId") REFERENCES "AcademicRegister"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_academicRegisterLessonId_fkey" FOREIGN KEY ("academicRegisterLessonId") REFERENCES "AcademicRegisterLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseGroup" ADD CONSTRAINT "CourseGroup_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_courseGroupId_fkey" FOREIGN KEY ("courseGroupId") REFERENCES "CourseGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTime" ADD CONSTRAINT "ScheduleTime_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTeacher" ADD CONSTRAINT "ScheduleTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTeacher" ADD CONSTRAINT "ScheduleTeacher_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThematicPlan" ADD CONSTRAINT "ThematicPlan_academicRegisterId_fkey" FOREIGN KEY ("academicRegisterId") REFERENCES "AcademicRegister"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThematicPlan" ADD CONSTRAINT "ThematicPlan_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThematicPlanDescription" ADD CONSTRAINT "ThematicPlanDescription_thematicPlanId_fkey" FOREIGN KEY ("thematicPlanId") REFERENCES "ThematicPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentExam" ADD CONSTRAINT "StudentExam_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentExam" ADD CONSTRAINT "StudentExam_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAnswerOption" ADD CONSTRAINT "StudentAnswerOption_studentExamId_fkey" FOREIGN KEY ("studentExamId") REFERENCES "StudentExam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAnswerOption" ADD CONSTRAINT "StudentAnswerOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAnswerOption" ADD CONSTRAINT "StudentAnswerOption_testQuestionId_fkey" FOREIGN KEY ("testQuestionId") REFERENCES "TestQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_courseGroupId_fkey" FOREIGN KEY ("courseGroupId") REFERENCES "CourseGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamTranslation" ADD CONSTRAINT "ExamTranslation_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestion" ADD CONSTRAINT "TestQuestion_examTranslationId_fkey" FOREIGN KEY ("examTranslationId") REFERENCES "ExamTranslation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestion" ADD CONSTRAINT "TestQuestion_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamTranslationTests" ADD CONSTRAINT "ExamTranslationTests_testQuestionId_fkey" FOREIGN KEY ("testQuestionId") REFERENCES "TestQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamTranslationTests" ADD CONSTRAINT "ExamTranslationTests_examTranslationId_fkey" FOREIGN KEY ("examTranslationId") REFERENCES "ExamTranslation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_testQuestionId_fkey" FOREIGN KEY ("testQuestionId") REFERENCES "TestQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRegister" ADD CONSTRAINT "AcademicRegister_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRegister" ADD CONSTRAINT "AcademicRegister_courseGroupId_fkey" FOREIGN KEY ("courseGroupId") REFERENCES "CourseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRegister" ADD CONSTRAINT "AcademicRegister_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRegisterDay" ADD CONSTRAINT "AcademicRegisterDay_academicRegisterId_fkey" FOREIGN KEY ("academicRegisterId") REFERENCES "AcademicRegister"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRegisterLesson" ADD CONSTRAINT "AcademicRegisterLesson_academicRegisterId_fkey" FOREIGN KEY ("academicRegisterId") REFERENCES "AcademicRegister"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRegisterLesson" ADD CONSTRAINT "AcademicRegisterLesson_academicRegisterDayId_fkey" FOREIGN KEY ("academicRegisterDayId") REFERENCES "AcademicRegisterDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

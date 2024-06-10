import { Exam, ExamStatusEnum, LanguageTypeEnum } from '@prisma/client';
import { ConflictException, ForbiddenException, NotFoundException } from 'next-api-decorators';
import { v4 as uuid } from 'uuid';
import { SortingType } from '@/api/types/common';
import {
  CreateExamValidation,
  ExamValidation,
  OptionalExamValidation,
  UpdateExamStatusValidation,
} from '@/utils/validation/exam';
import { orderBy } from './utils/common';
import prisma from '..';

export class ExamsResolver {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    return Promise.all([
      prisma.exam.count(),
      prisma.exam.findMany({
        select: {
          id: true,
          status: true,
          examLanguages: {
            select: {
              language: true,
              testQuestions: {
                select: {
                  id: true,
                },
              },
            },
          },
          course: {
            select: {
              title: true,
            },
          },
          courseGroup: {
            select: {
              title: true,
            },
          },
          subject: {
            select: {
              id: true,
              title: true,
            },
          },
          createdAt: true,
        },
        orderBy: sorting ? orderBy(sorting) : undefined,
        skip,
        take,
      }),
    ]).then(([count, exams]) => ({
      count,
      exams,
    }));
  }

  static async createExam(data: CreateExamValidation) {
    const { subjectId, courseId, courseGroupId, studentIds, duration } = data;
    const createdExam = await prisma.exam.create({
      data: {
        courseId,
        courseGroupId,
        subjectId,
        duration: +duration,
      },
      select: {
        id: true,
      },
    });

    await prisma.studentExam.createMany({
      data: studentIds.map(studentId => ({
        studentId,
        examId: createdExam.id,
      })),
    });

    return createdExam;
  }

  static async deleteExamById(id: string) {
    return prisma.exam
      .findUnique({
        where: {
          id,
        },
      })
      .then(exam => {
        if (!exam) {
          throw new NotFoundException('Exam with this id does not exist');
        }

        return prisma.exam.delete({
          where: {
            id,
          },
        });
      });
  }

  static async createExamTranslation(
    examId: string,
    language: LanguageTypeEnum,
    input: ExamValidation,
  ) {
    const { title, description, testQuestionIds } = input;

    if (!examId) {
      throw new ConflictException('No exam id provided');
    }

    const exam = await this.getExamById(examId);

    if (!exam) {
      throw new ConflictException('Exam with provided id is not found');
    }

    const createdTranslation = await prisma.examTranslation.create({
      data: {
        examId: exam.id,
        title,
        description,
        language,
      },
    });

    await prisma.testQuestion.updateMany({
      where: {
        id: {
          in: testQuestionIds,
        },
      },
      data: {
        examTranslationId: createdTranslation.id,
      },
    });

    return true;
  }

  static async getExamTranslationByExamIdAndLanguage(examId: string, language: LanguageTypeEnum) {
    const examTranslation = await prisma.examTranslation.findUnique({
      where: {
        examLanguage: {
          examId,
          language,
        },
      },
      select: {
        id: true,
        language: true,
        title: true,
        description: true,
        testQuestions: {
          where: {
            language,
          },
          select: {
            id: true,
          },
        },
      },
    });

    return examTranslation;
  }

  static async updateExamTranslation(
    examId: string,
    language: LanguageTypeEnum,
    input: OptionalExamValidation,
  ) {
    const { title, description, testQuestionIds } = input;

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      throw new NotFoundException('Exam was not found');
    }

    return prisma.examTranslation.update({
      where: {
        examLanguage: {
          examId,
          language,
        },
      },
      data: {
        title,
        description,
        testQuestions: {
          set: testQuestionIds.map(id => ({ id })),
        },
      },
    });
  }

  static async getExamById(id: string) {
    return prisma.exam
      .findUnique({
        where: { id },
      })
      .then(res => {
        if (!res) {
          throw new NotFoundException('Exam was not found');
        }
        return res;
      });
  }

  static async getExamTranslationByExamId(id: string) {
    return prisma.exam.findUnique({
      where: {
        id,
      },
      select: {
        examLanguages: {
          select: {
            id: true,
            language: true,
            testQuestions: {
              take: 1,
              orderBy: {
                orderNumber: 'asc',
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
  }

  static getFirstTestQuestion(examTranslationId: string) {
    return prisma.testQuestion.findFirst({
      where: {
        examTranslationId,
      },
      orderBy: {
        orderNumber: 'asc',
      },
      select: {
        id: true,
      },
    });
  }

  static async checkUserPermissionToStartExam(studentId: string, examId: string) {
    return prisma.studentExam.findUnique({
      where: {
        studentExamId: {
          studentId,
          examId,
        },
        exam: {
          status: ExamStatusEnum.IN_PROGRESS,
        },
      },
      select: {
        id: true,
      },
    });
  }

  static async getExamList() {
    return prisma.exam.findMany();
  }

  static async updateExamById(examId: string, data: Partial<Exam>) {
    const { id } = await this.getExamById(examId);

    return prisma.exam.update({
      where: {
        id,
      },
      data,
    });
  }

  static async getExamDataById(examId?: string) {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      select: {
        id: true,
        examLanguages: {
          select: {
            id: true,
            title: true,
            description: true,
            language: true,
            testQuestions: {
              select: {
                _count: true,
              },
            },
          },
        },
      },
    });

    return exam;
  }

  static async getTestQuestion(testQuestionId: string) {
    if (!testQuestionId) {
      throw new NotFoundException('Invalid Data');
    }

    try {
      const testQuestion = await prisma.testQuestion.findUniqueOrThrow({
        where: { id: testQuestionId },
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          orderNumber: true,
          examTranslationId: true,
          options: { select: { id: true, title: true } },
          examTranslation: {
            select: {
              exam: {
                select: {
                  duration: true,
                  examStartTime: true,
                },
              },
            },
          },
        },
      });

      const { orderNumber } = testQuestion;

      const [previousQuestion, nextQuestion, answers] = await Promise.all([
        prisma.testQuestion.findFirst({
          where: {
            examTranslationId: testQuestion.examTranslationId,
            orderNumber: { lt: orderNumber },
          },
          orderBy: { orderNumber: 'desc' },
          select: { id: true },
        }),
        prisma.testQuestion.findFirst({
          where: {
            examTranslationId: testQuestion.examTranslationId,
            orderNumber: { gt: orderNumber },
          },
          orderBy: { orderNumber: 'asc' },
          select: { id: true },
        }),
        prisma.studentAnswerOption.findMany({ where: { testQuestionId } }),
      ]);

      return {
        testQuestion,
        answers,
        previousQuestionId: previousQuestion?.id || null,
        nextQuestionId: nextQuestion?.id || null,
        duration: testQuestion.examTranslation?.exam.duration,
        startTime: testQuestion.examTranslation?.exam.examStartTime,
      };
    } catch (error) {
      console.log({ error });
    }
  }

  static async createStudentAnswer(
    optionsIds: string[],
    studentId?: string,
    examId?: string,
    testId?: string,
  ) {
    if (!studentId || !examId || !testId) {
      throw new NotFoundException('Invalid Data');
    }

    const studentExam = await prisma.studentExam.findUnique({
      where: { studentExamId: { examId, studentId } },
    });

    if (!studentExam) {
      throw new NotFoundException();
    }

    const existOptions = await prisma.studentAnswerOption.findMany({
      where: { testQuestionId: testId },
    });

    if (!!existOptions.length) {
      await prisma.studentAnswerOption.deleteMany({ where: { testQuestionId: testId } });
    }

    await prisma.studentAnswerOption.createManyAndReturn({
      data: optionsIds.map(optionId => ({
        optionId,
        studentExamId: studentExam.id,
        testQuestionId: testId,
      })),
    });

    return true;
  }

  static async updateExamStatus(id: string, input: UpdateExamStatusValidation) {
    const exam = await prisma.exam.findUnique({
      where: {
        id,
      },
    });

    if (!exam) {
      throw new NotFoundException('Exam was not found');
    }

    return prisma.exam.update({
      where: {
        id,
      },
      data: { ...input, examStartTime: new Date() },
    });
  }

  static async createStudentUuid(examId: string, studentId: string, req: any) {
    const studentUuidCookie: string = req.cookies['student-exam-uuid'];

    const studentExam = await prisma.studentExam.findUnique({
      where: {
        studentExamId: {
          examId,
          studentId,
        },
      },
    });

    if (!studentExam) {
      throw new NotFoundException('Student exam is not found');
    }

    if (studentUuidCookie) {
      const isUserAllowed = await prisma.studentExam.findUnique({
        where: {
          studentExamId: {
            examId,
            studentId,
          },
          studentUuid: studentUuidCookie,
        },
      });

      console.log({ isUserAllowed });

      if (!isUserAllowed) {
        throw new ForbiddenException('Another user is already taking the exam');
      }
    }

    const uniqueId = uuid();

    await prisma.studentExam.update({
      where: {
        studentExamId: {
          examId,
          studentId,
        },
      },
      data: {
        studentUuid: uniqueId,
      },
    });

    return { uniqueId };
  }
}

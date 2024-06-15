import { Exam, ExamStatusEnum, LanguageTypeEnum } from '@prisma/client';
import { ConflictException, NotFoundException } from 'next-api-decorators';
import { User } from 'next-auth';
import { SortingType } from '@/api/types/common';
import {
  CreateExamValidation,
  ExamValidation,
  OptionalExamValidation,
  UpdateExamStatusValidation,
} from '@/utils/validation/exam';
import { orderBy } from './utils/common';
import prisma from '..';

function checkStudentAnswers(testQuestions: any, studentAnswerGroupedByTestQuestion: any) {
  return testQuestions.map(({ id, options }: any) => {
    const studentAnswers = studentAnswerGroupedByTestQuestion.get(id) || [];
    const correctOptions = options.map((option: { id: string }) => option.id);

    const isCorrect = correctOptions.every((correctOption: any) =>
      studentAnswers.includes(correctOption),
    );

    return { testQuestionId: id, isCorrect };
  });
}

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
    try {
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

      await prisma.examTranslationTests.createMany({
        data: testQuestionIds.map((testQuestionId: string) => ({
          testQuestionId,
          examTranslationId: createdTranslation.id,
        })),
      });

      return true;
    } catch (error) {
      console.log({ error });
    }
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

  static async getFirstTestQuestion(examTranslationId: string) {
    const examTranslationTests = await prisma.examTranslationTests.findFirst({
      where: {
        examTranslationId,
      },
      select: {
        id: true,
        testQuestion: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
      },
    });

    return examTranslationTests;
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

  static async getTestQuestion(
    examId: string,
    testQuestionId: string,
    examTranslationId: string,
    user: User,
  ) {
    if (!testQuestionId) {
      throw new NotFoundException('Invalid Data');
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    });

    if (exam?.status === 'COMPLETED') {
      throw new ConflictException('Exam time has expired');
    }

    try {
      const examTestQuestion = await prisma.examTranslationTests.findUniqueOrThrow({
        where: { id: testQuestionId },
        select: {
          testQuestion: {
            select: {
              id: true,
              title: true,
              description: true,
              type: true,
              orderNumber: true,
              options: { select: { id: true, title: true } },
              examTranslation: {
                select: {
                  exam: {
                    select: {
                      id: true,
                      duration: true,
                      examStartTime: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const { testQuestion } = examTestQuestion;
      const { orderNumber } = testQuestion;

      const [previousQuestion, nextQuestion, answers] = await Promise.all([
        prisma.examTranslationTests.findFirst({
          where: {
            examTranslationId,
            testQuestion: {
              orderNumber: { lt: orderNumber },
            },
          },
          orderBy: { testQuestion: { orderNumber: 'desc' } },
          select: { id: true, testQuestionId: true },
        }),
        prisma.examTranslationTests.findFirst({
          where: {
            examTranslationId,
            testQuestion: {
              orderNumber: { gt: orderNumber },
            },
          },
          orderBy: { testQuestion: { orderNumber: 'asc' } },
          select: { id: true, testQuestionId: true },
        }),
        prisma.studentAnswerOption.findMany({
          where: {
            testQuestionId: examTestQuestion.testQuestion.id,
            studentExam: {
              examId,
              studentId: user?.student?.id,
            },
          },
        }),
      ]);

      return {
        testQuestion: examTestQuestion.testQuestion,
        answers,
        previousQuestionId: previousQuestion?.id || null,
        nextQuestionId: nextQuestion?.id || null,
      };
    } catch (error) {
      console.log({ error });
    }
  }

  static async getExamDurationInfo(id: string) {
    const exam = await prisma.exam.findUnique({
      where: {
        id,
      },
      select: {
        duration: true,
        examStartTime: true,
      },
    });

    if (!exam) {
      throw new NotFoundException('Exam was not found');
    }

    return exam;
  }

  static async createStudentAnswer(
    optionsIds: Array<string | undefined>,
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

    const examTranslationTest = await prisma.examTranslationTests.findUniqueOrThrow({
      where: {
        id: testId,
      },
      select: {
        testQuestionId: true,
      },
    });

    const existOptions = await prisma.studentAnswerOption.findMany({
      where: { testQuestionId: examTranslationTest.testQuestionId },
    });

    if (!!existOptions.length) {
      await prisma.studentAnswerOption.deleteMany({
        where: { testQuestionId: examTranslationTest.testQuestionId },
      });
    }

    const filteredAnswers = optionsIds.filter(Boolean);

    if (filteredAnswers.length) {
      await prisma.studentAnswerOption.createManyAndReturn({
        data: filteredAnswers.map(optionId => ({
          optionId,
          studentExamId: studentExam.id,
          testQuestionId: examTranslationTest.testQuestionId,
        })),
      });
    }

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

  static async finishExam(studentId?: string, examId?: string) {
    if (!studentId || !examId) {
      throw new NotFoundException('Invalid data');
    }

    const finished = await prisma.studentExam.update({
      where: { studentExamId: { studentId, examId } },
      data: { hasFinished: true },
    });

    return !!finished;
  }

  static async getResults(studentId: string, examId: string, examTranslationId: string) {
    if (!studentId || !examId) {
      throw new NotFoundException('Invalid data');
    }

    const studentExam = await prisma.studentExam.findUniqueOrThrow({
      where: { studentExamId: { studentId, examId } },
    });

    const result = await prisma.studentAnswerOption.findMany({
      where: { studentExamId: studentExam.id },
      select: { options: true, testQuestionId: true },
    });

    const studentAnswerGroupedByTestQuestion = new Map();

    result.forEach(({ testQuestionId, options }) => {
      const existingAnswers = studentAnswerGroupedByTestQuestion.get(testQuestionId) || [];
      studentAnswerGroupedByTestQuestion.set(testQuestionId, [...existingAnswers, options?.id]);
    });

    const examTranslationTests = await prisma.examTranslationTests.findMany({
      where: {
        examTranslationId,
      },
      select: {
        testQuestion: {
          select: {
            id: true,
            options: {
              where: {
                isRightAnswer: true,
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const data = examTranslationTests.map(exTest => exTest.testQuestion);

    const studentResult = checkStudentAnswers(data, studentAnswerGroupedByTestQuestion);

    return {
      rightAnswers: studentResult.filter(({ isCorrect }: any) => isCorrect).length,
      total: studentResult.length,
    };
  }

  static async getStudentsExamResults(examId: string) {
    const examTr = await prisma.examTranslation.findFirstOrThrow({
      where: {
        examId,
      },
    });

    const studentExams = await prisma.studentExam.findMany({
      where: {
        examId,
        hasFinished: true,
        exam: {
          examLanguages: {
            some: {
              id: examTr.id,
            },
          },
        },
      },
      select: {
        exam: {
          select: {
            examLanguages: {
              select: {
                id: true,
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        id: true,
      },
    });

    const examTranslationTests = await prisma.examTranslationTests.findMany({
      where: {
        examTranslationId: examTr.id,
      },
      select: {
        testQuestion: {
          select: {
            id: true,
            options: {
              where: {
                isRightAnswer: true,
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const results = [];

    for (const { student, id: studentExamId } of studentExams) {
      const result = await prisma.studentAnswerOption.findMany({
        where: { studentExamId },
        select: { options: true, testQuestionId: true },
      });

      const studentAnswerGroupedByTestQuestion = new Map();

      result.forEach(({ testQuestionId, options }) => {
        const existingAnswers = studentAnswerGroupedByTestQuestion.get(testQuestionId) || [];
        studentAnswerGroupedByTestQuestion.set(testQuestionId, [...existingAnswers, options?.id]);
      });
      const testQuestions = examTranslationTests.map(exTest => exTest.testQuestion);

      const studentResult = checkStudentAnswers(testQuestions, studentAnswerGroupedByTestQuestion);

      results.push({
        student,
        rightAnswers: studentResult.filter(({ isCorrect }: any) => isCorrect).length,
        total: studentResult.length,
      });
    }

    return results;
  }

  static async getIsFinished(studentId?: string, examId?: string) {
    if (!studentId || !examId) {
      throw new NotFoundException('Invalid data');
    }

    const exam = await prisma.studentExam.findUnique({
      where: { studentExamId: { studentId, examId } },
    });

    return !!exam?.hasFinished;
  }
}

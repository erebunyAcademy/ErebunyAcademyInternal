import { Exam, ExamStatusEnum, LanguageTypeEnum, Prisma } from '@prisma/client';
import { ConflictException, ForbiddenException, NotFoundException } from 'next-api-decorators';
import { User } from 'next-auth';
import {
  CreateExamValidation,
  ExamValidation,
  OptionalExamValidation,
  UpdateExamStatusValidation,
} from '@/utils/validation/exam';
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
  static async list(skip: number, take: number, search: string, sortBy: string, orderBy: string) {
    const searchFilter: Prisma.ExamWhereInput = search
      ? {
          OR: [
            {
              courseGroup: {
                title: { contains: search, mode: 'insensitive' },
              },
            },
            {
              course: {
                title: { contains: search, mode: 'insensitive' },
              },
            },
            {
              faculty: {
                title: { contains: search, mode: 'insensitive' },
              },
            },
            {
              examLanguages: {
                some: {
                  title: { contains: search, mode: 'insensitive' },
                },
              },
            },
          ],
        }
      : {};

    const whereClause: Prisma.ExamWhereInput = {
      isArchived: false,
      ...searchFilter,
    };

    return Promise.all([
      prisma.exam.count({
        where: whereClause,
      }),
      prisma.exam.findMany({
        where: whereClause,
        select: {
          duration: true,
          id: true,
          status: true,
          studentExams: {
            select: {
              studentId: true,
            },
          },
          examLanguages: {
            select: {
              title: true,
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
              id: true,
              title: true,
              facultyId: true,
              faculty: {
                select: {
                  title: true,
                  id: true,
                },
              },
            },
          },
          courseGroup: {
            select: {
              id: true,
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
        orderBy:
          sortBy && orderBy
            ? {
                [sortBy]: orderBy,
              }
            : { createdAt: 'desc' },
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

  static async updateExam(data: CreateExamValidation, examId: string) {
    const { subjectId, courseId, courseGroupId, studentIds, duration } = data;

    try {
      await prisma.$transaction(async prisma => {
        const existingExam = await prisma.exam.findUniqueOrThrow({
          where: { id: examId },
        });

        await prisma.exam.update({
          where: { id: existingExam.id },
          data: {
            courseId,
            courseGroupId,
            subjectId,
            duration: +duration,
          },
          select: { id: true },
        });

        await prisma.studentExam.deleteMany({
          where: {
            examId: existingExam.id,
            studentId: {
              notIn: studentIds,
            },
          },
        });

        const existingStudentExams = await prisma.studentExam.findMany({
          where: {
            examId: existingExam.id,
            studentId: {
              in: studentIds,
            },
          },
          select: { studentId: true },
        });

        const existingStudentIds = new Set(existingStudentExams.map(se => se.studentId));

        const newStudentExams = studentIds
          .filter(studentId => !existingStudentIds.has(studentId))
          .map(studentId => ({
            studentId,
            examId: existingExam.id,
          }));

        if (newStudentExams.length > 0) {
          await prisma.studentExam.createMany({
            data: newStudentExams,
          });
        }
      });

      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
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

        if (exam.status === 'IN_PROGRESS') {
          throw new ForbiddenException('Not allowed');
        }

        return prisma.exam.update({
          where: {
            id,
          },
          data: {
            isArchived: true,
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
    console.log({ examId, language });
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

    const studentExam = await prisma.studentExam.findUniqueOrThrow({
      where: {
        studentExamId: {
          examId,
          studentId: user?.student?.id!,
        },
      },
      select: {
        id: true,
      },
    });

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
            studentExamId: studentExam.id,
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
      where: { testQuestionId: examTranslationTest.testQuestionId, studentExamId: studentExam.id },
    });

    if (!!existOptions.length) {
      await prisma.studentAnswerOption.deleteMany({
        where: {
          testQuestionId: examTranslationTest.testQuestionId,
          studentExamId: studentExam.id,
        },
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

    if (input.status === 'COMPLETED') {
      await prisma.studentExam.updateMany({
        where: {
          examId: id,
        },
        data: {
          hasFinished: true,
        },
      });
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

    const examResult = {
      rightAnswers: studentResult.filter(({ isCorrect }: any) => isCorrect).length,
      total: studentResult.length,
    };

    await prisma.studentExam.update({
      where: { id: studentExam.id },
      data: {
        studentExamResult: `${examResult.rightAnswers}/${examResult.total}`,
      },
    });

    return examResult;
  }

  static async getStudentsExamResults(examId: string) {
    const exam = await prisma.exam.findUniqueOrThrow({
      where: {
        id: examId,
      },
    });

    return prisma.studentExam.findMany({
      where: {
        examId: exam.id,
        hasFinished: true,
      },
      include: {
        exam: {
          include: {
            examLanguages: true,
          },
        },
        student: {
          include: {
            user: true,
          },
        },
      },
    });
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

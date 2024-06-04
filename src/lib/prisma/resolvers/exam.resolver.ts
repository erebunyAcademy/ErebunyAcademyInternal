import { Exam, LanguageTypeEnum } from '@prisma/client';
import { ConflictException, NotFoundException } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import {
  CreateExamValidation,
  ExamValidation,
  OptionalExamValidation,
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

  static async createExamTranslation(input: ExamValidation, examId?: string) {
    const { title, description, testQuestionIds, language } = input;

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

    const exam = this.getExamById(examId);

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
        testQuestions:
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

  static async getExamDataById(examId: string) {
    console.log({ examId });
  }
}

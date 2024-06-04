import { LanguageTypeEnum } from '@prisma/client';
import { BadRequestException } from 'next-api-decorators';
import { TestQuestionValidation } from '@/utils/validation/exam';
import prisma from '..';

export class TestQuestionResolver {
  static getTestQuestionsBySubjectId(subjectId: string, language: LanguageTypeEnum) {
    return prisma.testQuestion.findMany({
      where: {
        subjectId,
        language,
      },
      select: {
        options: {
          select: {
            title: true,
          },
        },
        title: true,
        id: true,
      },
    });
  }

  static async create(body: TestQuestionValidation, subjectId: string, language: LanguageTypeEnum) {
    if (!subjectId) {
      throw new BadRequestException('Invalid data');
    }

    const createOptions = body.questions.map(item => {
      return prisma.testQuestion.create({
        data: {
          subjectId,
          title: item.title,
          type: item.type,
          skillLevel: 'EASY',
          language,
          options: {
            createMany: {
              data: item.options.map(el => ({
                title: el.title,
                isRightAnswer: el.isRightAnswer,
              })),
            },
          },
        },
      });
    });

    await Promise.all(createOptions);

    return true;
  }
}

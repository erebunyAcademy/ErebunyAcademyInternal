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
        topic: true,
        subTopic: true,
        category: true,
      },
    });
  }

  static async create(body: TestQuestionValidation, subjectId: string, lang: LanguageTypeEnum) {
    if (!subjectId) {
      throw new BadRequestException('Invalid data');
    }

    const createOptions = body.questions.map(item => {
      return prisma.testQuestion.create({
        data: {
          subjectId,
          title: item.title,
          type: item.type,
          skillLevel: item.skillLevel,
          category: item.category,
          topic: item.topic,
          subTopic: item.subTopic,
          language: lang,
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

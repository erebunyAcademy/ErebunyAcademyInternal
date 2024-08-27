import { GradeLevelTypeEnum } from '@prisma/client';
import prisma from '..';

export class GradeLevelResolver {
  static list(type: GradeLevelTypeEnum) {
    return prisma.gradeLevel.findMany({
      where: {
        type,
      },
      select: {
        id: true,
        level: true,
      },
    });
  }
}

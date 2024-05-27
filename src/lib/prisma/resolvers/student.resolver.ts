import { AttachmentTypeEnum, UserRoleEnum } from '@prisma/client';
import { NotFoundException } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { orderBy } from './utils/common';
import prisma from '..';

export class StudentResolver {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    const [count, users] = await Promise.all([
      prisma.user.count({
        where: {
          role: UserRoleEnum.STUDENT,
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
      }),
      prisma.user.findMany({
        where: {
          role: UserRoleEnum.STUDENT,
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          attachment: {
            select: {
              key: true,
              type: true,
            },
          },
          student: {
            select: {
              faculty: {
                select: {
                  title: true,
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
            },
          },
        },
        orderBy: sorting ? orderBy(sorting) : undefined,
        skip,
        take,
      }),
    ]);

    return {
      count,
      users,
    };
  }
  static getStudentById(id: string) {
    return prisma.student
      .findUnique({
        where: { id },
      })
      .then(res => {
        if (!res) {
          throw new NotFoundException('Student was not found');
        }
        return res;
      });
  }

  static getStudentsByCourseGroupId(courseGroupId: string) {
    return prisma.student.findMany({
      where: {
        courseGroupId,
      },
      select: {
        id: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            attachment: {
              where: {
                type: AttachmentTypeEnum.AVATAR,
              },
              select: {
                key: true,
              },
            },
          },
        },
      },
    });
  }
}

import { UserRoleEnum } from '@prisma/client';
import { NotFoundException } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { orderBy } from './utils/common';
import prisma from '..';

export class TeacherResolver {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    return Promise.all([
      prisma.user.count({
        where: {
          role: UserRoleEnum.TEACHER,
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
      }),
      prisma.user.findMany({
        where: {
          role: UserRoleEnum.TEACHER,
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
          teacher: {
            select: {
              workPlace: true,
              profession: true,
            },
          },
        },
        orderBy: sorting ? orderBy(sorting) : undefined,
        skip,
        take,
      }),
    ]).then(([count, users]) => ({
      count,
      users,
    }));
  }
  static getTeacherById(id: string) {
    return prisma.student
      .findUnique({
        where: { id },
      })
      .then(res => {
        if (!res) {
          throw new NotFoundException('Teacher was not found');
        }
        return res;
      });
  }
}

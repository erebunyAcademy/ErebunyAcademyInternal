import { UserRoleEnum } from '@prisma/client';
import { ForbiddenException, NotFoundException } from 'next-api-decorators';
import { User } from 'next-auth';
import { SortingType } from '@/api/types/common';
import prisma from '..';
import { orderBy } from './utils/common';

export class TeacherResolver {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    return Promise.all([
      prisma.user.count({
        where: {
          isVerified: true,
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
          isVerified: true,
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
          isAdminVerified: true,
          teacher: {
            select: {
              workPlace: true,
              profession: true,
            },
          },
        },
        orderBy: sorting ? orderBy(sorting) : [{ firstName: 'asc' }, { lastName: 'asc' }],
        skip,
        take,
      }),
    ]).then(([count, users]) => ({
      count,
      users,
    }));
  }

  static getTeachers() {
    return prisma.user.findMany({
      where: {
        role: UserRoleEnum.TEACHER,
        isAdminVerified: true,
      },
      select: {
        firstName: true,
        lastName: true,
        teacher: {
          select: {
            id: true,
          },
        },
      },
    });
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

  static async getTeacherSchedules(user: NonNullable<User>) {
    if (!user.teacher?.id) {
      throw new ForbiddenException();
    }

    const scheduleIds = (
      await prisma.scheduleTeacher.findMany({
        where: { teacherId: user.teacher.id },
        select: {
          scheduleId: true,
        },
      })
    ).reduce((acc: string[], schedule) => {
      if (schedule.scheduleId) {
        acc.push(schedule.scheduleId);
      }
      return acc;
    }, [] as string[]);

    return prisma.schedule.findMany({
      where: {
        id: {
          in: scheduleIds,
        },
      },
      include: {
        subject: true,
        attachment: true,
        thematicPlans: {
          include: {
            thematicPlanDescription: true,
          },
        },
        courseGroup: {
          include: {
            course: true,
          },
        },
      },
    });
  }
}

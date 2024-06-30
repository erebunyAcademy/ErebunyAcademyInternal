import { AttachmentTypeEnum, Prisma, UserRoleEnum } from '@prisma/client';
import { NotFoundException } from 'next-api-decorators';
import { User } from 'next-auth';
import { SortingType } from '@/api/types/common';
import { UpdateStudentValidation } from '@/utils/validation/student';
import { orderBy } from './utils/common';
import prisma from '..';

export class StudentResolver {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    const OR: Prisma.UserWhereInput[] = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];

    const [count, users] = await Promise.all([
      prisma.user.count({
        where: {
          role: UserRoleEnum.STUDENT,
          isVerified: true,
          OR,
        },
      }),
      prisma.user.findMany({
        where: {
          isVerified: true,
          role: UserRoleEnum.STUDENT,
          OR,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          isAdminVerified: true,
          attachment: {
            select: {
              key: true,
              type: true,
            },
          },
          student: {
            select: {
              id: true,
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
                  id: true,
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

  static getStudentExams(user: User) {
    return prisma.studentExam.findMany({
      where: {
        studentId: user?.student?.id,
      },
      select: {
        exam: {
          select: {
            status: true,
            duration: true,
            id: true,
            examLanguages: {
              select: {
                title: true,
                language: true,
              },
            },
            subject: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });
  }

  static getStudentsByCourseGroupId(courseGroupId: string) {
    return prisma.student.findMany({
      where: {
        courseGroupId,
        user: {
          isVerified: true,
          isAdminVerified: true,
        },
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

  static async updateStudentData(data: UpdateStudentValidation, studentId: string) {
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      throw new NotFoundException('User was not found');
    }

    return prisma.student.update({
      where: {
        id: studentId,
      },
      data,
    });
  }

  static async getStudentsInfoByExamId(examId: string) {
    await prisma.exam.findUniqueOrThrow({
      where: {
        id: examId,
      },
    });

    return prisma.studentExam.findMany({
      where: {
        examId,
      },
      select: {
        student: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }
}

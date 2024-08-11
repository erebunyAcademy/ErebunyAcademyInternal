import { AttachmentTypeEnum, Prisma, UserRoleEnum } from '@prisma/client';
import { ForbiddenException, NotFoundException } from 'next-api-decorators';
import { User } from 'next-auth';
import { UpdateStudentValidation } from '@/utils/validation/student';
import prisma from '..';

export class StudentResolver {
  static async list(skip: number, take: number, search: string, sortBy: string, orderBy: string) {
    const OR: Prisma.UserWhereInput[] = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      {
        student: {
          courseGroup: {
            title: { contains: search, mode: 'insensitive' },
          },
        },
      },
      {
        student: {
          course: {
            title: { contains: search, mode: 'insensitive' },
          },
        },
      },
      {
        student: {
          faculty: {
            title: { contains: search, mode: 'insensitive' },
          },
        },
      },
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
        orderBy:
          sortBy && orderBy
            ? {
                [sortBy]: orderBy,
              }
            : {
                createdAt: 'desc',
              },
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
        id: true,
        studentExamResult: true,
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

  static async getStudentCyclicSchedule(user: NonNullable<User>) {
    if (!user.student?.courseGroup?.id) {
      throw new ForbiddenException('User does not have course group');
    }

    return prisma.schedule.findMany({
      where: {
        courseGroupId: user.student.courseGroup.id,
      },
      include: {
        thematicPlans: {
          include: {
            thematicPlanDescription: true,
          },
        },
        attachment: true,
        subject: true,
      },
    });
  }
}

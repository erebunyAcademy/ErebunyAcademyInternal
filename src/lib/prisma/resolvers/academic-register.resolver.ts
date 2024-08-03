import { User } from 'next-auth';
import prisma from '..';

export class AcademicRegisterResolver {
  static async cycliclist(user: NonNullable<User>) {
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!teacher) {
      throw new Error('User is not a teacher');
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        scheduleTeachers: {
          some: {
            teacherId: teacher.id,
          },
        },
      },
      include: {
        courseGroup: {
          include: {
            course: true,
          },
        },
        subject: true,
      },
    });

    return schedules;
  }
  static async notCycliclist(user: NonNullable<User>) {
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!teacher) {
      throw new Error('User is not a teacher');
    }

    const schedules = await prisma.nonCyclicSchedule.findMany({
      where: {
        scheduleTeachers: {
          some: {
            teacherId: teacher.id,
          },
        },
      },
      include: {
        courseGroup: {
          include: {
            course: true,
          },
        },
      },
    });

    return schedules;
  }

  static async getCyclicRegisterById(scheduleId: string, user: NonNullable<User>) {
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!teacher) {
      throw new Error('User is not a teacher');
    }

    return prisma.schedule.findUniqueOrThrow({
      where: {
        id: scheduleId,
        scheduleTeachers: {
          some: {
            teacherId: teacher.id,
          },
        },
      },
      include: {
        courseGroup: true,
      },
    });
  }
  static async getNonCyclicRegisterById(scheduleId: string, user: NonNullable<User>) {
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!teacher) {
      throw new Error('User is not a teacher');
    }

    return prisma.nonCyclicSchedule.findUniqueOrThrow({
      where: {
        id: scheduleId,
        scheduleTeachers: {
          some: {
            teacherId: teacher.id,
          },
        },
      },
      include: {
        courseGroup: true,
        availableDays: true,
        subject: true,
      },
    });
  }
}

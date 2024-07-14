import { ThematicSubPlanTypeEnum } from '@prisma/client';
import { SortingType } from '@/api/types/common';
import { CreateEditScheduleValidation } from '@/utils/validation/schedule';
import { orderBy } from './utils/common';
import prisma from '..';

export class ScheduleResolver {
  static list(skip: number, take: number, search: string, sorting: SortingType[]) {
    return Promise.all([
      prisma.schedule.count({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
      }),
      prisma.schedule.findMany({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
        select: {
          id: true,
          title: true,
          description: true,
          totalHours: true,
          startDayDate: true,
          endDayDate: true,
          isAssessment: true,
          createdAt: true,
        },
        orderBy: sorting ? orderBy(sorting) : undefined,
        skip,
        take,
      }),
    ]).then(([count, schedules]) => ({
      count,
      schedules,
    }));
  }

  static async createSchedule(data: CreateEditScheduleValidation) {
    const {
      title,
      description,
      practicalClass,
      theoreticalClass,
      totalHours,
      startDayDate,
      endDayDate,
      teacherId,
      links,
      subjectId,
      examDate,
    } = data;

    const thematicPlans = [
      {
        totalHours: +practicalClass.totalHours,
        type: ThematicSubPlanTypeEnum.PRACTICAL,
        thematicPlanDescription: {
          create: practicalClass.classDescriptionRow.map(row => ({
            title: row.title,
            hour: row.hour,
          })),
        },
      },
      {
        totalHours: +theoreticalClass.totalHours,
        type: ThematicSubPlanTypeEnum.THEORETICAL,
        thematicPlanDescription: {
          create: theoreticalClass.classDescriptionRow.map(row => ({
            title: row.title,
            hour: row.hour,
          })),
        },
      },
    ];

    const createdSchedule = await prisma.schedule.create({
      data: {
        title,
        description,
        totalHours: +totalHours,
        startDayDate: new Date(startDayDate),
        endDayDate: new Date(endDayDate),
        isAssessment: data.isAssessment,
        subjectId: data.subjectId,
        links: links.map(({ link }) => link),
        thematicPlan: {
          create: thematicPlans,
        },
        scheduleTeachers: {
          create: {
            teacherId,
            subjectId,
          },
        },
        examDate,
      },
    });

    return createdSchedule;
  }
}

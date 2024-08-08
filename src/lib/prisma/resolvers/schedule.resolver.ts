import { AttachmentTypeEnum, ScheduleTypeEnum, ThematicSubPlanTypeEnum } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { SortingType } from '@/api/types/common';
import { CreateEditNonCylicScheduleValidation } from '@/utils/validation/non-cyclic';
import {
  AddEditThematicPlanValidation,
  CreateEditScheduleValidation,
} from '@/utils/validation/schedule';
import { orderBy } from './utils/common';
import prisma from '..';

export class ScheduleResolver {
  static list(
    type: ScheduleTypeEnum,
    skip: number,
    take: number,
    search: string,
    sorting: SortingType[],
  ) {
    return Promise.all([
      prisma.schedule.count({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
          type,
        },
      }),
      prisma.schedule.findMany({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
          type,
        },
        include: {
          thematicPlans: {
            include: {
              thematicPlanDescription: true,
            },
          },
          scheduleTeachers: {
            select: {
              teacher: {
                select: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
              teacherId: true,
            },
          },
          attachment: {
            select: {
              key: true,
              title: true,
              mimetype: true,
            },
          },
          subject: true,
          courseGroup: true,
          availableDays: true,
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

  static async createCyclicThematicPlan(scheduleId: string, data: AddEditThematicPlanValidation) {
    const cyclicSchedule = await prisma.schedule.findFirstOrThrow({
      where: {
        id: scheduleId,
      },
    });

    const { practicalClass, theoreticalClass } = data;

    await prisma.thematicPlan.create({
      data: {
        scheduleId: cyclicSchedule.id,
        totalHours: +practicalClass.totalHours,
        type: ThematicSubPlanTypeEnum.PRACTICAL,
        thematicPlanDescription: {
          create: practicalClass.classDescriptionRow.map(row => ({
            title: row.title,
            hour: row.hour,
          })),
        },
      },
    });

    // Create Theoretical Thematic Plan
    return prisma.thematicPlan.create({
      data: {
        scheduleId: cyclicSchedule.id,
        totalHours: +theoreticalClass.totalHours,
        type: ThematicSubPlanTypeEnum.THEORETICAL,
        thematicPlanDescription: {
          create: theoreticalClass.classDescriptionRow.map(row => ({
            title: row.title,
            hour: row.hour,
          })),
        },
      },
    });
  }

  static async updateThematicPlan(scheduleId: string, data: AddEditThematicPlanValidation) {
    const thematicPlan = await prisma.thematicPlan.findFirst({
      where: {
        scheduleId,
      },
      select: {
        scheduleId: true,
      },
    });

    await prisma.thematicPlan.deleteMany({
      where: { scheduleId },
    });

    if (thematicPlan?.scheduleId) {
      return ScheduleResolver.createCyclicThematicPlan(scheduleId, data);
    }

    return ScheduleResolver.createNoCyclicThematicPlan(scheduleId, data);
  }

  static async createSchedule(
    data: CreateEditScheduleValidation | CreateEditNonCylicScheduleValidation,
    type: ScheduleTypeEnum,
  ) {
    if (type === ScheduleTypeEnum.CYCLIC) {
      const {
        title,
        description,
        totalHours,
        startDayDate,
        endDayDate,
        teacherId,
        links,
        subjectId,
        examDate,
        attachments,
      } = data as CreateEditScheduleValidation;

      const createdSchedule = await prisma.schedule.create({
        data: {
          courseGroupId: data.courseGroupId,
          title,
          type,
          description,
          examType: data.examType,
          totalHours: +totalHours,
          startDayDate: new Date(startDayDate),
          endDayDate: new Date(endDayDate),
          subjectId: data.subjectId,
          academicYear: data.academicYear,
          links: links.map(({ link }) => link),
          scheduleTeachers: {
            create: {
              teacherId,
              subjectId,
            },
          },
          examDate: new Date(examDate),
        },
        select: {
          id: true,
        },
      });

      if (attachments) {
        await prisma.attachment.createMany({
          data: attachments.map(attachment => ({
            title: attachment.title,
            key: attachment.key,
            scheduleId: createdSchedule.id,
            type: AttachmentTypeEnum.FILE,
            mimetype: attachment.mimetype,
          })),
        });
      }

      return createdSchedule;
    } else {
      const {
        academicYear,
        availableDays,
        description,
        totalHours,
        examType,
        teacherId,
        links,
        subjectId,
        title,
        attachments,
        courseGroupId,
      } = data as CreateEditNonCylicScheduleValidation;

      const createdSchedule = await prisma.schedule.create({
        data: {
          type,
          title,
          courseGroupId,
          description,
          academicYear,
          subjectId,
          examType,

          totalHours: +totalHours,
          links: links.map(({ link }) => link),
          scheduleTeachers: {
            create: {
              teacherId,
              subjectId,
            },
          },
        },
        select: {
          id: true,
        },
      });

      await prisma.scheduleTime.createMany({
        data: availableDays.map(day => ({
          availableDay: day.availableDay,
          period: day.period,
          scheduleId: createdSchedule.id,
        })),
      });

      if (attachments) {
        await prisma.attachment.createMany({
          data: attachments.map(attachment => ({
            title: attachment.title,
            key: attachment.key,
            nonCyclicScheduleId: createdSchedule.id,
            type: AttachmentTypeEnum.FILE,
            mimetype: attachment.mimetype,
          })),
        });
      }

      return createdSchedule;
    }
  }

  static async updateSchedule(
    id: string,
    data: CreateEditScheduleValidation | CreateEditNonCylicScheduleValidation,
  ) {
    const schedule = await prisma.schedule.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (schedule.type === ScheduleTypeEnum.CYCLIC) {
      const {
        title,
        description,
        totalHours,
        startDayDate,
        endDayDate,
        teacherId,
        links,
        subjectId,
        examDate,
        attachments,
        examType,
        courseGroupId,
      } = data as CreateEditScheduleValidation;

      return prisma.$transaction(async prisma => {
        await prisma.thematicPlan.deleteMany({
          where: { scheduleId: schedule.id },
        });

        await prisma.scheduleTeacher.deleteMany({
          where: { scheduleId: schedule.id },
        });

        const updatedSchedule = await prisma.schedule.update({
          where: {
            id: schedule.id,
          },
          data: {
            title,
            description,
            examType,
            courseGroupId,
            totalHours: +totalHours,
            startDayDate: new Date(startDayDate),
            endDayDate: new Date(endDayDate),
            subjectId: data.subjectId,
            academicYear: data.academicYear,
            links: {
              set: links.map(({ link }) => link),
            },
            scheduleTeachers: {
              create: {
                teacherId,
                subjectId,
              },
            },
            examDate: new Date(examDate),
          },
          select: {
            id: true,
          },
        });

        const existingAttachments = await prisma.attachment.findMany({
          where: {
            scheduleId: schedule.id,
          },
        });

        const existingAttachmentKeys = new Set(existingAttachments.map(att => att.key));
        const newAttachmentKeys = new Set(attachments?.map(att => att.key) || []);

        const attachmentsToDelete = existingAttachments.filter(
          att => !newAttachmentKeys.has(att.key),
        );

        for (const attachment of attachmentsToDelete) {
          const filePath = path.join(process.cwd(), 'uploads', attachment.key);
          if (filePath) {
            await fs.promises.unlink(filePath);
          }
        }

        await prisma.attachment.deleteMany({
          where: {
            key: {
              in: attachmentsToDelete.map(att => att.key),
            },
          },
        });

        const attachmentsToCreate = attachments?.filter(
          att => !existingAttachmentKeys.has(att.key),
        );

        if (attachmentsToCreate?.length) {
          await prisma.attachment.createMany({
            data: attachmentsToCreate.map(attachment => ({
              title: attachment.title,
              key: attachment.key,
              scheduleId: updatedSchedule.id,
              type: AttachmentTypeEnum.FILE,
              mimetype: attachment.mimetype,
            })),
          });
        }

        return updatedSchedule;
      });
    } else {
      const {
        availableDays,
        description,
        totalHours,
        teacherId,
        links,
        subjectId,
        title,
        attachments,
        courseGroupId,
        examType,
        academicYear,
      } = data as CreateEditNonCylicScheduleValidation;
      return prisma.$transaction(async prisma => {
        await prisma.thematicPlan.deleteMany({
          where: { scheduleId: schedule.id },
        });

        await prisma.scheduleTeacher.deleteMany({
          where: { scheduleId: schedule.id },
        });

        await prisma.scheduleTime.deleteMany({
          where: {
            scheduleId: schedule.id,
          },
        });

        await prisma.scheduleTime.createMany({
          data: availableDays.map(day => ({
            availableDay: day.availableDay,
            period: day.period,
            scheduleId: schedule.id,
          })),
        });

        const updatedSchedule = await prisma.schedule.update({
          where: {
            id: schedule.id,
          },
          data: {
            courseGroupId,
            title,
            description,
            examType,
            academicYear,
            totalHours: +totalHours,
            subjectId: data.subjectId,
            links: {
              set: links.map(({ link }) => link),
            },
            scheduleTeachers: {
              create: {
                teacherId,
                subjectId,
              },
            },
          },
          select: {
            id: true,
          },
        });

        const existingAttachments = await prisma.attachment.findMany({
          where: {
            scheduleId: schedule.id,
          },
        });

        const existingAttachmentKeys = new Set(existingAttachments.map(att => att.key));
        const newAttachmentKeys = new Set(attachments?.map(att => att.key) || []);

        const attachmentsToDelete = existingAttachments.filter(
          att => !newAttachmentKeys.has(att.key),
        );

        for (const attachment of attachmentsToDelete) {
          const filePath = path.join(process.cwd(), 'uploads', attachment.key);
          if (filePath) {
            await fs.promises.unlink(filePath);
          }
        }

        await prisma.attachment.deleteMany({
          where: {
            key: {
              in: attachmentsToDelete.map(att => att.key),
            },
          },
        });

        const attachmentsToCreate = attachments?.filter(
          att => !existingAttachmentKeys.has(att.key),
        );

        if (attachmentsToCreate?.length) {
          await prisma.attachment.createMany({
            data: attachmentsToCreate.map(attachment => ({
              title: attachment.title,
              key: attachment.key,
              nonCycleSchedule: updatedSchedule.id,
              type: AttachmentTypeEnum.FILE,
              mimetype: attachment.mimetype,
            })),
          });
        }

        return updatedSchedule;
      });
    }
  }

  static async deleteSchedule(id: string) {
    const schedule = await prisma.schedule.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        attachment: true,
      },
    });

    for (const attachment of schedule.attachment) {
      const filePath = path.join(process.cwd(), 'uploads', attachment.key);
      try {
        await fs.promises.access(filePath);
        await fs.promises.unlink(filePath);
      } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      }
    }

    return prisma.schedule.delete({
      where: {
        id: schedule.id,
      },
    });
  }

  static getCyclicSchedule(id: string) {
    return prisma.schedule.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        attachment: true,
        scheduleTeachers: {
          include: {
            teacher: {
              select: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        thematicPlans: {
          include: {
            thematicPlanDescription: true,
          },
        },
        subject: true,
        courseGroup: true,
      },
    });
  }
}

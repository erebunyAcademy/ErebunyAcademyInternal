import { Schedule } from '@prisma/client';
import { NotFoundException } from 'next-api-decorators';
import prisma from '..';

export type ScheduleUpdateableType = Omit<Schedule, 'id'>;

export class ScheduleResolver {
  static createSchedule(data: ScheduleUpdateableType) {
    return prisma.schedule.create({ data });
  }

  static getScheduleById(id: string) {
    return prisma.schedule
      .findUnique({
        where: { id },
      })
      .then(res => {
        if (!res) {
          throw new NotFoundException('Schedule was not found');
        }
        return res;
      });
  }

  static getScheduleList() {
    return prisma.schedule.findMany();
  }

  static async updateScheduleById(scheduleId: string, data: Partial<ScheduleUpdateableType>) {
    const { id } = await this.getScheduleById(scheduleId);

    return prisma.schedule.update({
      where: {
        id,
      },
      data,
    });
  }

  static async deleteScheduleById(examId: string) {
    const { id } = await this.getScheduleById(examId);
    return prisma.schedule.delete({
      where: {
        id,
      },
    });
  }
}

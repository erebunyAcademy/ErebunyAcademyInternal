import { Faculty } from '@prisma/client';
import { NotFoundException } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { orderBy } from './utils/common';
import prisma from '..';

export class FacultyResolver {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    console.log({ skip, search, take, sorting });

    const [count, users] = await Promise.all([
      prisma.faculty.count({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
      }),
      prisma.faculty.findMany({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
        select: { id: true, title: true, description: true, createdAt: true },
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

  static createFaculty(data: Pick<Faculty, 'title' | 'description'>) {
    return prisma.faculty.create({ data });
  }

  static getFacultyById(id: number) {
    return prisma.faculty
      .findUnique({
        where: { id },
      })
      .then(res => {
        if (!res) {
          throw new NotFoundException('Faculty was not found');
        }
        return res;
      });
  }

  static async updateFacultyById(facultyId: number, data: Partial<Faculty>) {
    const { id } = await this.getFacultyById(facultyId);

    return prisma.faculty.update({
      where: {
        id,
      },
      data,
    });
  }

  static async deleteFacultyById(examId: number) {
    const { id } = await this.getFacultyById(examId);
    return prisma.faculty.delete({
      where: {
        id,
      },
    });
  }
}

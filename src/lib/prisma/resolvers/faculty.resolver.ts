import { Faculty } from '@prisma/client';
import { NotFoundException } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { orderBy } from './utils/common';
import prisma from '..';

export class FacultyResolver {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    return Promise.all([
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
    ]).then(([count, faculties]) => ({
      count,
      faculties,
    }));
  }

  static getFacultyList() {
    return prisma.faculty.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }

  static createFaculty(data: Pick<Faculty, 'title' | 'description'>) {
    return prisma.faculty.create({ data });
  }

  static async getFacultyById(id: string) {
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

  static async updateFacultyById(facultyId: string, data: Partial<Faculty>) {
    const { id } = await this.getFacultyById(facultyId);

    return prisma.faculty.update({
      where: {
        id,
      },
      data,
    });
  }

  static async deleteFacultyById(facultyId: string) {
    const { id } = await this.getFacultyById(facultyId);
    return prisma.faculty.delete({
      where: {
        id,
      },
    });
  }
}

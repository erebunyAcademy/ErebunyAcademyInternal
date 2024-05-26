// import { SubjectCategory } from '@prisma/client';
// import { NotFoundException } from 'next-api-decorators';
// import { SortingType } from '@/api/types/common';
// import { orderBy } from './utils/common';
// import prisma from '..';

// export class SubjectCategoryResolver {
//   static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
//     return Promise.all([
//       prisma.subjectCategory.count({
//         where: {
//           OR: [{ title: { contains: search, mode: 'insensitive' } }],
//         },
//       }),
//       prisma.subjectCategory.findMany({
//         where: {
//           OR: [{ title: { contains: search, mode: 'insensitive' } }],
//         },
//         select: {
//           id: true,
//           title: true,
//           description: true,
//           subject: {
//             select: {
//               title: true,
//             },
//           },
//         },
//         orderBy: sorting ? orderBy(sorting) : undefined,
//         skip,
//         take,
//       }),
//     ]).then(([count, subjectCategories]) => ({
//       count,
//       subjectCategories,
//     }));
//   }

//   static getSubjectCategoryList() {
//     return prisma.subjectCategory.findMany({
//       select: {
//         id: true,
//         title: true,
//       },
//     });
//   }

//   static getSubjectCategoryListBySubjectId(subjectId: string) {
//     return prisma.subjectCategory.findMany({
//       where: {
//         subjectId,
//       },
//       select: {
//         id: true,
//         title: true,
//       },
//     });
//   }

//   static async getSubjectCategoryById(id: string) {
//     return prisma.subjectCategory
//       .findUnique({
//         where: { id },
//       })
//       .then(res => {
//         if (!res) {
//           throw new NotFoundException('Subject Category was not found');
//         }
//         return res;
//       });
//   }

//   static createSubjectCategory(data: Pick<SubjectCategory, 'title' | 'description'>) {
//     return prisma.subjectCategory.create({ data });
//   }

//   static async updateSubjectCategoryById(subjectId: string, data: Partial<SubjectCategory>) {
//     const { id } = await this.getSubjectCategoryById(subjectId);

//     return prisma.subjectCategory.update({
//       where: {
//         id,
//       },
//       data,
//     });
//   }

//   static async deleteSubjectCategoryById(subjectId: string) {
//     const { id } = await this.getSubjectCategoryById(subjectId);
//     return prisma.subjectCategory.delete({
//       where: {
//         id,
//       },
//     });
//   }
// }

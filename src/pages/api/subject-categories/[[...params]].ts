// import { SubjectCategory } from '@prisma/client';
// import {
//   Body,
//   Catch,
//   createHandler,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Query,
//   ValidationPipe,
// } from 'next-api-decorators';
// import { SortingType } from '@/api/types/common';
// import { exceptionHandler } from '@/lib/prisma/error';
//  import { SubjectCategoryResolver } from '@/lib/prisma/resolvers/subject-category.resolver';

// @Catch(exceptionHandler)
// class SubjectCategoryHandler {
//   @Get('/list')
//   getSubjectCategoryList(
//     @Query('offset') skip: string,
//     @Query('limit') take: string,
//     @Query('search') search: string,
//     @Query('sorting') sorting: SortingType[],
//   ) {
//     return SubjectCategoryResolver.list(+skip, +take, search, sorting);
//   }

//   @Get('')
//   getSubjectCategories() {
//     return SubjectCategoryResolver.getSubjectCategoryList();
//   }

//   @Get('/subject/:subjectId')
//   getSubjectCategoriesBySubjectId(@Param('subjectId') subjectId: string) {
//     return SubjectCategoryResolver.getSubjectCategoryListBySubjectId(subjectId);
//   }

//   @Get('/:id')
//   getSubjectCategoryById(@Param('id') id: string) {
//     return SubjectCategoryResolver.getSubjectCategoryById(id);
//   }

//   @Delete('/:id')
//   deleteSubjectCategory(@Param('id') id: string) {
//     return SubjectCategoryResolver.deleteSubjectCategoryById(id);
//   }

//   @Post()
//   createSubjectCategory(
//     @Body(ValidationPipe) input: Pick<SubjectCategory, 'title' | 'description'>,
//   ) {
//     return SubjectCategoryResolver.createSubjectCategory(input);
//   }

//   @Patch('/:subjectCategoryId')
//   updateSubjectCategory(
//     @Param('subjectCategoryId') subjectCategoryId: string,
//     @Body(ValidationPipe) input: Partial<Pick<SubjectCategory, 'title' | 'description'>>,
//   ) {
//     return SubjectCategoryResolver.updateSubjectCategoryById(subjectCategoryId, input);
//   }
// }

// export default createHandler(SubjectCategoryHandler);

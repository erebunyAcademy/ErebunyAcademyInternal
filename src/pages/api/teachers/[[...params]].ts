import { Catch, createHandler, Get, Query } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { exceptionHandler } from '@/lib/prisma/error';
import { TeacherResolver } from '@/lib/prisma/resolvers/teacher.resolver';

@Catch(exceptionHandler)
class TeachersHandler {
  @Get('/list')
  _list(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return TeacherResolver.list(+skip, +take, search, sorting);
  }
}

export default createHandler(TeachersHandler);

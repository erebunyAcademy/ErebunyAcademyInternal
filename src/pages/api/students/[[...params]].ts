import { Catch, createHandler, Get, Query } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { exceptionHandler } from '@/lib/prisma/error';
import { StudentResolver } from '@/lib/prisma/resolvers/student.resolver';

@Catch(exceptionHandler)
class StudentsHandler {
  @Get('/list')
  _getAllStudents(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return StudentResolver.list(+skip, +take, search, sorting);
  }
}

export default createHandler(StudentsHandler);

import { Catch, createHandler, Get, Post, Query } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { exceptionHandler } from '@/lib/prisma/error';
import { ExamsResolver } from '@/lib/prisma/resolvers/exam.resolver';

@Catch(exceptionHandler)
class ExamsHandler {
  @Get('/list')
  _list(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return ExamsResolver.list(+skip, +take, search, sorting);
  }

  @Post()
  _createExam() {
    return ExamsResolver.createExam();
  }
}

export default createHandler(ExamsHandler);

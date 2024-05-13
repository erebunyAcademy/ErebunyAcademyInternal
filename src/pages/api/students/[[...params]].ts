import { Catch, createHandler, Get, Param, Query } from 'next-api-decorators';
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

  @Get('/student-grade-group/:studentGradeGroupId')
  getStudentsByGradeGroupId(@Param('studentGradeGroupId') studentGradeGroupId: string) {
    return StudentResolver.getStudentsByStudentGradeGroupId(studentGradeGroupId);
  }
}

export default createHandler(StudentsHandler);

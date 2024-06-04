import { Catch, createHandler, Get, Param, Query } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { exceptionHandler } from '@/lib/prisma/error';
import { AdminGuard } from '@/lib/prisma/guards/admin';
import { StudentResolver } from '@/lib/prisma/resolvers/student.resolver';

@Catch(exceptionHandler)
class StudentsHandler {
  @AdminGuard()
  @Get('/list')
  _getAllStudents(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return StudentResolver.list(+skip, +take, search, sorting);
  }

  @AdminGuard()
  @Get('/course-group/:courseGroupId')
  getStudentsByCourseId(@Param('courseGroupId') courseGroupId: string) {
    return StudentResolver.getStudentsByCourseGroupId(courseGroupId);
  }
}

export default createHandler(StudentsHandler);

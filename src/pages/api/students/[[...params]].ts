import { Catch, createHandler, Get, Param, Query } from 'next-api-decorators';
import { User } from 'next-auth';
import { SortingType } from '@/api/types/common';
import { CurrentUser } from '@/lib/prisma/decorators/current-user.decorator';
import { exceptionHandler } from '@/lib/prisma/error';
import { AdminGuard } from '@/lib/prisma/guards/admin';
import { StudentGuard } from '@/lib/prisma/guards/student';
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

  @StudentGuard()
  @Get('/exams')
  getStudentExams(@CurrentUser() user: NonNullable<User>) {
    return StudentResolver.getStudentExams(user);
  }
}

export default createHandler(StudentsHandler);

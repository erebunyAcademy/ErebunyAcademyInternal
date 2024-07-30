import { Catch, createHandler, Get, Query } from 'next-api-decorators';
import { User } from 'next-auth';
import { SortingType } from '@/api/types/common';
import { CurrentUser } from '@/lib/prisma/decorators/current-user.decorator';
import { exceptionHandler } from '@/lib/prisma/error';
import { AdminGuard } from '@/lib/prisma/guards/admin';
import { TeacherGuard } from '@/lib/prisma/guards/teacher';
import { TeacherResolver } from '@/lib/prisma/resolvers/teacher.resolver';

@Catch(exceptionHandler)
class TeachersHandler {
  @AdminGuard()
  @Get('/list')
  _list(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return TeacherResolver.list(+skip, +take, search, sorting);
  }

  @Get()
  @AdminGuard()
  _teacherData() {
    return TeacherResolver.getTeachers();
  }

  @TeacherGuard()
  @Get('/schedules/cyclic')
  getStudentCyclicSchedule(@CurrentUser() user: NonNullable<User>) {
    return TeacherResolver.getTeacherCyclicSchedule(user);
  }

  @TeacherGuard()
  @Get('/schedules/no-cyclic')
  getStudentNoneCyclicSchedule(@CurrentUser() user: NonNullable<User>) {
    return TeacherResolver.getTeacherNonCyclicSchedule(user);
  }
}

export default createHandler(TeachersHandler);

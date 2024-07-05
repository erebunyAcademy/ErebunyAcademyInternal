import {
  Body,
  Catch,
  createHandler,
  Get,
  Param,
  Patch,
  Query,
  ValidationPipe,
} from 'next-api-decorators';
import { User } from 'next-auth';
import { CurrentUser } from '@/lib/prisma/decorators/current-user.decorator';
import { exceptionHandler } from '@/lib/prisma/error';
import { AdminGuard } from '@/lib/prisma/guards/admin';
import { StudentGuard } from '@/lib/prisma/guards/student';
import { StudentResolver } from '@/lib/prisma/resolvers/student.resolver';
import { UpdateStudentValidation } from '@/utils/validation/student';

@Catch(exceptionHandler)
class StudentsHandler {
  @AdminGuard()
  @Get('/list')
  _getAllStudents(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
    @Query('orderBy') orderBy: string,
  ) {
    return StudentResolver.list(+skip, +take, search, sortBy, orderBy);
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

  @AdminGuard()
  @Patch('/:studentId')
  updateStudentByStudentId(
    @Body(ValidationPipe) input: UpdateStudentValidation,
    @Param('studentId') studentId: string,
  ) {
    return StudentResolver.updateStudentData(input, studentId);
  }

  @AdminGuard()
  @Get('/exams/:examId')
  getStudentsInfoByExamId(@Param('examId') examId: string) {
    return StudentResolver.getStudentsInfoByExamId(examId);
  }
}

export default createHandler(StudentsHandler);

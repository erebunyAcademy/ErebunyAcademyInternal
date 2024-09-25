import {
  Body,
  Catch,
  createHandler,
  Get,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from 'next-api-decorators';
import { User } from 'next-auth';
import { CurrentUser } from '@/lib/prisma/decorators/current-user.decorator';
import { exceptionHandler } from '@/lib/prisma/error';
import { AdminGuard } from '@/lib/prisma/guards/admin';
import { StudentGuard } from '@/lib/prisma/guards/student';
import { AcademicRegisterResolver } from '@/lib/prisma/resolvers/academic-register.resolver';
import {
  CreateStudentAttendanceRecordValidation,
  UpdateStudentAttendanceRecordsValidation,
} from '@/utils/validation/academic-register';

@Catch(exceptionHandler)
class AcademicRegisterHandler {
  @Get('/list')
  getCyclicList(@CurrentUser() user: NonNullable<User>) {
    return AcademicRegisterResolver.list(user);
  }

  @Post('/schedules/:scheduleId')
  createStudentAddentanceRecord(
    @Param('scheduleId') scheduleId: string,
    @Body(ValidationPipe) input: CreateStudentAttendanceRecordValidation,
    @CurrentUser() user: NonNullable<User>,
    @Query('lessonOfTheDay') lessonOfTheDay: string,
  ) {
    return AcademicRegisterResolver.createStudentAddentanceRecord(
      scheduleId,
      input,
      user,
      lessonOfTheDay,
    );
  }

  @Get()
  getAcademicRegisterData(
    @CurrentUser() user: NonNullable<User>,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return AcademicRegisterResolver.getStudentAcademicRegisterdata(user, startDate, endDate);
  }

  @Get('/:scheduleId/lessons')
  getAcademicRegisterLessons(
    @Param('scheduleId') scheduleId: string,
    @CurrentUser() user: NonNullable<User>,
  ) {
    return AcademicRegisterResolver.getTeacherAcademicRegisterLessonList(scheduleId, user);
  }

  @Get(`/course-groups/:courseGroupId`)
  @AdminGuard()
  getCourseGroupAcademicRegister(
    @Param('courseGroupId') courseGroupId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return AcademicRegisterResolver.getAcademicRegisterByCourseGroupId(
      courseGroupId,
      startDate,
      endDate,
    );
  }

  @Get('/student-attendance')
  @StudentGuard()
  getStudentAbsentLessonsCount(
    @CurrentUser() user: NonNullable<User>,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return AcademicRegisterResolver.getStudentAbsentLessonCount(user, startDate, endDate);
  }

  @Put('/attendant-records')
  updateStudentAttendance(@Body(ValidationPipe) input: UpdateStudentAttendanceRecordsValidation) {
    return AcademicRegisterResolver.changeAttendanceRecordData(input);
  }
}

export default createHandler(AcademicRegisterHandler);

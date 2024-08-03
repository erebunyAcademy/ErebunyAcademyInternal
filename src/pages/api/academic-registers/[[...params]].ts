import { Catch, createHandler, Get, Param } from 'next-api-decorators';
import { User } from 'next-auth';
import { CurrentUser } from '@/lib/prisma/decorators/current-user.decorator';
import { exceptionHandler } from '@/lib/prisma/error';
import { AdminGuard } from '@/lib/prisma/guards/admin';
import { AcademicRegisterResolver } from '@/lib/prisma/resolvers/academic-register.resolver';

@Catch(exceptionHandler)
class AcademicRegisterHandler {
  @Get('/cyclic-list')
  getCyclicList(@CurrentUser() user: NonNullable<User>) {
    return AcademicRegisterResolver.cycliclist(user);
  }

  @AdminGuard()
  @Get('/not-cyclic-list')
  getNotCyclicList(@CurrentUser() user: NonNullable<User>) {
    return AcademicRegisterResolver.notCycliclist(user);
  }

  @AdminGuard()
  @Get('/cyclic-list/:scheduleId')
  getCyclicRegisterById(
    @Param('scheduleId') scheduleId: string,
    @CurrentUser() user: NonNullable<User>,
  ) {
    return AcademicRegisterResolver.getCyclicRegisterById(scheduleId, user);
  }

  @Get('/not-cyclic-list/:scheduleId')
  getNotCyclicRegisterById(
    @Param('scheduleId') scheduleId: string,
    @CurrentUser() user: NonNullable<User>,
  ) {
    return AcademicRegisterResolver.getNonCyclicRegisterById(scheduleId, user);
  }
}

export default createHandler(AcademicRegisterHandler);

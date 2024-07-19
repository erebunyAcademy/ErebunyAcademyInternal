import {
  Body,
  Catch,
  createHandler,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { exceptionHandler } from '@/lib/prisma/error';
import { AdminGuard } from '@/lib/prisma/guards/admin';
import { ScheduleResolver } from '@/lib/prisma/resolvers/schedule.resolver';
import { CreateEditScheduleValidation } from '@/utils/validation/schedule';

@Catch(exceptionHandler)
class FacultyHandler {
  @AdminGuard()
  @Get('/list')
  _list(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return ScheduleResolver.list(+skip, +take, search, sorting);
  }

  @Post()
  _createSchedule(@Body(ValidationPipe) input: CreateEditScheduleValidation) {
    return ScheduleResolver.createSchedule(input);
  }

  @Patch('/:scheduleId')
  _updateSchedule(
    @Param('scheduleId') scheduleId: string,
    @Body(ValidationPipe) input: CreateEditScheduleValidation,
  ) {
    return ScheduleResolver.updateSchedule(scheduleId, input);
  }

  @Delete('/:scheduleId')
  _deleteSchedule(@Param('scheduleId') scheduleId: string) {
    return ScheduleResolver.deleteSchedule(scheduleId);
  }
}

export default createHandler(FacultyHandler);

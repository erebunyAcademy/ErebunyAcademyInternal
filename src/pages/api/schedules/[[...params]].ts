import {
  Body,
  Catch,
  createHandler,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from 'next-api-decorators';
import { exceptionHandler } from '@/lib/prisma/error';
import { ScheduleResolver } from '@/lib/prisma/resolvers/schedule.resolver';
import type { ScheduleUpdateableType } from '@/lib/prisma/resolvers/schedule.resolver';

@Catch(exceptionHandler)
class ScheduleHandler {
  @Get('/:id')
  getSubjectById(@Param('id') id: string) {
    return ScheduleResolver.getScheduleById(+id);
  }

  @Get('/list')
  getSubjects() {
    return ScheduleResolver.getScheduleList();
  }

  @Delete('/:id')
  deleteSubject(@Param('id') id: string) {
    return ScheduleResolver.deleteScheduleById(+id);
  }

  @Post()
  createSubject(@Body(ValidationPipe) input: ScheduleUpdateableType) {
    return ScheduleResolver.createSchedule(input);
  }

  @Patch('/:subjectId')
  updateSubject(
    @Param('subjectId') subjectId: string,
    @Body(ValidationPipe) input: Partial<ScheduleUpdateableType>,
  ) {
    return ScheduleResolver.updateScheduleById(+subjectId, input);
  }
}

export default createHandler(ScheduleHandler);

import { ScheduleTypeEnum } from '@prisma/client';
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
import { exceptionHandler } from '@/lib/prisma/error';
import { AdminGuard } from '@/lib/prisma/guards/admin';
import { ScheduleResolver } from '@/lib/prisma/resolvers/schedule.resolver';
import { CreateEditNonCyclicScheduleValidation } from '@/utils/validation/non-cyclic';
import {
  AddEditThematicPlanValidation,
  CreateEditScheduleValidation,
  TeacherAttachmentModalValidation,
} from '@/utils/validation/schedule';

@Catch(exceptionHandler)
class ScheduleHandler {
  @AdminGuard()
  @Get('/list')
  _list(@Query('type') type: ScheduleTypeEnum) {
    return ScheduleResolver.list(type);
  }

  @Post()
  _createSchedule(
    @Query('type') type: ScheduleTypeEnum,
    @Body(ValidationPipe)
    input: CreateEditScheduleValidation | CreateEditNonCyclicScheduleValidation,
  ) {
    return ScheduleResolver.createSchedule(input, type);
  }

  @Patch('/:scheduleId')
  _updateSchedule(
    @Param('scheduleId') scheduleId: string,
    @Query('type') type: ScheduleTypeEnum,
    @Body(ValidationPipe) input: CreateEditScheduleValidation,
  ) {
    return ScheduleResolver.updateSchedule(scheduleId, input);
  }

  @Delete('/:scheduleId')
  _deleteSchedule(@Param('scheduleId') scheduleId: string) {
    return ScheduleResolver.deleteSchedule(scheduleId);
  }

  @Post('/:scheduleId/thematic-plan')
  _createThematicPlan(
    @Param('scheduleId') scheduleId: string,
    @Body(ValidationPipe) input: AddEditThematicPlanValidation,
  ) {
    return ScheduleResolver.createCyclicThematicPlan(scheduleId, input);
  }

  @Patch('/:scheduleId/thematic-plan')
  _updateThematicPlan(
    @Param('scheduleId') scheduleId: string,
    @Body(ValidationPipe) input: AddEditThematicPlanValidation,
  ) {
    return ScheduleResolver.updateThematicPlan(scheduleId, input);
  }

  @Get('/:scheduleId')
  _getCyclicScheduleDetails(@Param('scheduleId') scheduleId: string) {
    return ScheduleResolver.getScheduleById(scheduleId);
  }

  @Patch('/:scheduleId/attachments')
  _updateScheduleAttachments(
    @Param('scheduleId') scheduleId: string,
    @Body(ValidationPipe) input: TeacherAttachmentModalValidation,
  ) {
    return ScheduleResolver.createUpdateScheduleAttachment(scheduleId, input);
  }
}

export default createHandler(ScheduleHandler);

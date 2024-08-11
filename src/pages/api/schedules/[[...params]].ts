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
import { SortingType } from '@/api/types/common';
import { exceptionHandler } from '@/lib/prisma/error';
import { AdminGuard } from '@/lib/prisma/guards/admin';
import { ScheduleResolver } from '@/lib/prisma/resolvers/schedule.resolver';
import { CreateEditNonCylicScheduleValidation } from '@/utils/validation/non-cyclic';
import {
  AddEditThematicPlanValidation,
  CreateEditScheduleValidation,
} from '@/utils/validation/schedule';

@Catch(exceptionHandler)
class ScheduleHandler {
  @AdminGuard()
  @Get('/list')
  _list(
    @Query('type') type: ScheduleTypeEnum,
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return ScheduleResolver.list(type, +skip, +take, search, sorting);
  }

  @Post()
  _createSchedule(
    @Query('type') type: ScheduleTypeEnum,
    @Body(ValidationPipe)
    input: CreateEditScheduleValidation | CreateEditNonCylicScheduleValidation,
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
}

export default createHandler(ScheduleHandler);

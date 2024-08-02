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

  @Get('/cyclic/:scheduleId')
  _getCyclicScheduleDetails(@Param('scheduleId') scheduleId: string) {
    return ScheduleResolver.getCyclicSchedule(scheduleId);
  }

  //NON-CYCLIC
  @Get('/none-cyclic/list')
  _nonCyclicList(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return ScheduleResolver.nonCycleScheduleList(+skip, +take, search, sorting);
  }

  @Post('/none-cyclic')
  _createNoneCyclicSchedule(@Body(ValidationPipe) input: CreateEditNonCylicScheduleValidation) {
    return ScheduleResolver.createNonCyclicSchedule(input);
  }

  @Patch('/none-cyclic/:scheduleId')
  _updateNoneCyclicSchedule(
    @Param('scheduleId') scheduleId: string,
    @Body(ValidationPipe) input: CreateEditNonCylicScheduleValidation,
  ) {
    return ScheduleResolver.updateNonCycleSchedule(scheduleId, input);
  }

  @Delete('/none-cyclic/:scheduleId')
  _deleteNoneCyclicSchedule(@Param('scheduleId') scheduleId: string) {
    return ScheduleResolver.deleteNonCyclicSchedule(scheduleId);
  }

  @Post('/:scheduleId/no-cyclic/thematic-plan')
  _createNoCyclicThematicPlan(
    @Param('scheduleId') scheduleId: string,
    @Body(ValidationPipe) input: AddEditThematicPlanValidation,
  ) {
    return ScheduleResolver.createNoCyclicThematicPlan(scheduleId, input);
  }

  @Patch('/none-cyclic/:scheduleId/thematic-plan')
  _updateNonCyclicThematicPlan(
    @Param('scheduleId') scheduleId: string,
    @Body(ValidationPipe) input: AddEditThematicPlanValidation,
  ) {
    return ScheduleResolver.updateNonCyclicThematicPlan(scheduleId, input);
  }

  @Get('/none-cyclic/:scheduleId')
  _getNoCyclicScheduleDetails(@Param('scheduleId') scheduleId: string) {
    return ScheduleResolver.getNoCyclicSchedule(scheduleId);
  }
}

export default createHandler(ScheduleHandler);

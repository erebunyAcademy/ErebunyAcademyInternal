import { GradeLevelTypeEnum } from '@prisma/client';
import { Catch, createHandler, Get, Query } from 'next-api-decorators';
import { exceptionHandler } from '@/lib/prisma/error';
import { GradeLevelResolver } from '@/lib/prisma/resolvers/grade-level.resolver';

@Catch(exceptionHandler)
class GradeLevelsHandler {
  @Get('/list')
  list(@Query('type') type?: GradeLevelTypeEnum) {
    return GradeLevelResolver.list(type || GradeLevelTypeEnum.COURSE);
  }
}

export default createHandler(GradeLevelsHandler);

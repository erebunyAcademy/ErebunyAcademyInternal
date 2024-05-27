import { CourseGroup } from '@prisma/client';
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
import { CourseGroupResolver } from '@/lib/prisma/resolvers/course-group.resolver';

@Catch(exceptionHandler)
class CourseGroupHandler {
  @Get('/list')
  getCourseGroupList(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return CourseGroupResolver.list(+skip, +take, search, sorting);
  }

  @Get('')
  list() {
    return CourseGroupResolver.getCourseGroupList();
  }

  @Get('/course/:courseId')
  getCourseGroupsByCourseId(@Param('courseId') courseId: string) {
    return CourseGroupResolver.getCourseGroupListByCourseId(courseId);
  }

  @Get('/:id')
  getCourseGroupById(@Param('id') id: string) {
    return CourseGroupResolver.getCourseGroupById(id);
  }

  @Delete('/:id')
  deleteCourseGroup(@Param('id') id: string) {
    return CourseGroupResolver.deleteCourseGroupById(id);
  }

  @Post()
  createCourseGroup(@Body(ValidationPipe) input: Pick<CourseGroup, 'title' | 'description'>) {
    return CourseGroupResolver.createCourseGroup(input);
  }

  @Patch('/:courseGroupId')
  updateCourseGroup(
    @Param('courseGroupId') courseGroupId: string,
    @Body(ValidationPipe) input: Partial<Pick<CourseGroup, 'title' | 'description'>>,
  ) {
    return CourseGroupResolver.updateCourseById(courseGroupId, input);
  }
}

export default createHandler(CourseGroupHandler);

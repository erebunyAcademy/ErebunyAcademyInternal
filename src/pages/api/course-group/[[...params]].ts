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
import { CourseGroupResolver } from '@/lib/prisma/resolvers/course-group.resolver';
import { CreateEditCourseGroupValidation } from '@/utils/validation/courseGroup';

@Catch(exceptionHandler)
class CourseGroupHandler {
  @AdminGuard()
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

  @AdminGuard()
  @Get('/courses/:courseId')
  getCourseGroupsByCourseId(@Param('courseId') courseId: string) {
    return CourseGroupResolver.getCourseGroupListByCourseId(courseId);
  }

  @AdminGuard()
  @Get('/subjects/:subjectId')
  getCourseGroupsBySubjectId(@Param('subjectId') subjectId: string) {
    return CourseGroupResolver.getCourseGroupListBySubjectId(subjectId);
  }

  @Get('/:id')
  getCourseGroupById(@Param('id') id: string) {
    return CourseGroupResolver.getCourseGroupById(id);
  }

  @AdminGuard()
  @Delete('/:id')
  deleteCourseGroup(@Param('id') id: string) {
    return CourseGroupResolver.deleteCourseGroupById(id);
  }

  @AdminGuard()
  @Post()
  createCourseGroup(@Body(ValidationPipe) input: CreateEditCourseGroupValidation) {
    return CourseGroupResolver.createCourseGroup(input);
  }

  @AdminGuard()
  @Patch('/:courseGroupId')
  updateCourseGroup(
    @Param('courseGroupId') courseGroupId: string,
    @Body(ValidationPipe) input: CreateEditCourseGroupValidation,
  ) {
    return CourseGroupResolver.updateCourseGroupById(courseGroupId, input);
  }
}

export default createHandler(CourseGroupHandler);

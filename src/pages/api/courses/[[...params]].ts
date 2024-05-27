import { Course } from '@prisma/client';
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
import { CourseResolver } from '@/lib/prisma/resolvers/course.resolver';

@Catch(exceptionHandler)
class CourseHandler {
  @Get('/list')
  getStudentGradeList(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return CourseResolver.list(+skip, +take, search, sorting);
  }

  @Get('')
  getCourses() {
    return CourseResolver.getCoursesList();
  }

  @Get('/faculty/:facultyId')
  getCoursesByFacultyId(@Param('facultyId') facultyId: string) {
    return CourseResolver.getCoursesListByFacultyId(facultyId);
  }

  @Get('/:id')
  getCourseById(@Param('id') id: string) {
    return CourseResolver.getCourseById(id);
  }

  @Delete('/:id')
  deleteCourse(@Param('id') id: string) {
    return CourseResolver.deleteCourseById(id);
  }

  @Post()
  createCourse(@Body(ValidationPipe) input: Pick<Course, 'title' | 'description'>) {
    return CourseResolver.createCourses(input);
  }

  @Patch('/:courseId')
  updateCourse(
    @Param('courseId') courseId: string,
    @Body(ValidationPipe) input: Partial<Pick<Course, 'title' | 'description'>>,
  ) {
    return CourseResolver.updateCourseById(courseId, input);
  }
}

export default createHandler(CourseHandler);

import { StudentGrade, StudentGradeGroup } from '@prisma/client';
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
import { StudentGradeGroupResolver } from '@/lib/prisma/resolvers/student-grade-group.resolver';

@Catch(exceptionHandler)
class StudentGradeGroupHandler {
  @Get('/list')
  getStudentGradeGroupList(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return StudentGradeGroupResolver.list(+skip, +take, search, sorting);
  }

  @Get('/:id')
  getStudentGradeGroupById(@Param('id') id: string) {
    return StudentGradeGroupResolver.deleteStudentGradeGroupById(id);
  }

  @Delete('/:id')
  deleteStudentGradeGroup(@Param('id') id: string) {
    return StudentGradeGroupResolver.deleteStudentGradeGroupById(id);
  }

  @Post()
  createStudentGradeGroup(
    @Body(ValidationPipe) input: Pick<StudentGrade, 'title' | 'description'>,
  ) {
    return StudentGradeGroupResolver.createStudentGradeGroup(input);
  }

  @Patch('/:studentGradeGroupId')
  updateStudentGradeGroup(
    @Param('studentGradeGroupId') studentGradeGroupId: string,
    @Body(ValidationPipe) input: Partial<Pick<StudentGradeGroup, 'title' | 'description'>>,
  ) {
    return StudentGradeGroupResolver.updateStudentGradeGroupById(studentGradeGroupId, input);
  }
}

export default createHandler(StudentGradeGroupHandler);

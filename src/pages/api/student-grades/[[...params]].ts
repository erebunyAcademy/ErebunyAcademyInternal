import { StudentGrade } from '@prisma/client';
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
import { StudentGradeResolver } from '@/lib/prisma/resolvers/student-grade.resolver';

@Catch(exceptionHandler)
class StudentGradeHandler {
  @Get('/list')
  getStudentGradeList(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return StudentGradeResolver.list(+skip, +take, search, sorting);
  }

  @Get('')
  getStudentGrades() {
    return StudentGradeResolver.getStudentGradeList();
  }

  @Get('/faculty/:facultyId')
  getStudentGradesByFacultyId(@Param('facultyId') facultyId: string) {
    return StudentGradeResolver.getStudentGradeListByFacultyId(facultyId);
  }

  @Get('/:id')
  getStudentGradeById(@Param('id') id: string) {
    return StudentGradeResolver.getStudentGradeById(id);
  }

  @Delete('/:id')
  deleteStudentGrade(@Param('id') id: string) {
    return StudentGradeResolver.deleteStudentGradeById(id);
  }

  @Post()
  createStudentGrade(@Body(ValidationPipe) input: Pick<StudentGrade, 'title' | 'description'>) {
    return StudentGradeResolver.createStudentGrade(input);
  }

  @Patch('/:studentGradeId')
  updateStudentGrade(
    @Param('studentGradeId') studentGradeId: string,
    @Body(ValidationPipe) input: Partial<Pick<StudentGrade, 'title' | 'description'>>,
  ) {
    return StudentGradeResolver.updateStudentGradeById(studentGradeId, input);
  }
}

export default createHandler(StudentGradeHandler);

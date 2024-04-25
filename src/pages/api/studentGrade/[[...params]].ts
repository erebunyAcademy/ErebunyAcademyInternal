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
import { StudentGradeResolver } from '@/lib/prisma/resolvers/studentGrade';
import { StudentGrade } from '@prisma/client';

@Catch(exceptionHandler)
class StudentGradeHandler {
  @Get('/:id')
  getStudentGradeById(@Param('id') id: string) {
    return StudentGradeResolver.getStudentGradeById(+id);
  }

  @Get('/list')
  getStudentGradeList() {
    return StudentGradeResolver.getStudentGradeList();
  }

  @Delete('/:id')
  deleteStudentGrade(@Param('id') id: string) {
    return StudentGradeResolver.deleteStudentGradeById(+id);
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
    return StudentGradeResolver.updateStudentGradeById(+studentGradeId, input);
  }
}

export default createHandler(StudentGradeHandler);

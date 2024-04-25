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
import { SubjectResolver } from '@/lib/prisma/resolvers/subject';
import { Subject } from '@prisma/client';

@Catch(exceptionHandler)
class SubjectHandler {
  @Get('/:id')
  getSubjectById(@Param('id') id: string) {
    return SubjectResolver.getSubjectById(+id);
  }

  @Get('/list')
  getSubjects() {
    return SubjectResolver.getSubjects();
  }

  @Delete('/:id')
  deleteSubject(@Param('id') id: string) {
    return SubjectResolver.deleteSubjectById(+id);
  }

  @Post()
  createSubject(@Body(ValidationPipe) input: Pick<Subject, 'title' | 'description'>) {
    return SubjectResolver.createSubject(input);
  }

  @Patch('/:subjectId')
  updateSubject(
    @Param('subjectId') subjectId: string,
    @Body(ValidationPipe) input: Partial<Pick<Subject, 'title' | 'description'>>,
  ) {
    return SubjectResolver.updateSubjectById(+subjectId, input);
  }
}

export default createHandler(SubjectHandler);

import { Subject } from '@prisma/client';
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
import { SubjectResolver } from '@/lib/prisma/resolvers/subject.resolver';

@Catch(exceptionHandler)
class SubjectHandler {
  @AdminGuard()
  @Get('/list')
  _list(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return SubjectResolver.list(+skip, +take, search, sorting);
  }

  @Get()
  getSubjectsSignupList() {
    return SubjectResolver.getSubjects();
  }

  @AdminGuard()
  @Get('/:id')
  getSubjectById(@Param('id') id: string) {
    return SubjectResolver.getSubjectById(id);
  }

  @AdminGuard()
  @Delete('/:id')
  deleteSubject(@Param('id') id: string) {
    return SubjectResolver.deleteSubjectById(id);
  }

  @AdminGuard()
  @Post()
  createSubject(@Body(ValidationPipe) input: Pick<Subject, 'title' | 'description'>) {
    return SubjectResolver.createSubject(input);
  }

  @AdminGuard()
  @Patch('/:subjectId')
  updateSubject(
    @Param('subjectId') subjectId: string,
    @Body(ValidationPipe) input: Partial<Pick<Subject, 'title' | 'description'>>,
  ) {
    return SubjectResolver.updateSubjectById(subjectId, input);
  }
}

export default createHandler(SubjectHandler);

import { Faculty } from '@prisma/client';
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
import { FacultyResolver } from '@/lib/prisma/resolvers/faculty.resolver';

@Catch(exceptionHandler)
class FacultyHandler {
  @Get('/list')
  _list(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return FacultyResolver.list(+skip, +take, search, sorting);
  }

  @Get('get-list')
  getFacultySignupList() {
    return FacultyResolver.getFacultyList();
  }

  @Get('/:id')
  getFacultyById(@Param('id') id: string) {
    return FacultyResolver.getFacultyById(id);
  }

  @Delete('/:id')
  deleteFaculty(@Param('id') id: string) {
    return FacultyResolver.deleteFacultyById(id);
  }

  @Post()
  createFaculty(@Body(ValidationPipe) input: Pick<Faculty, 'title' | 'description'>) {
    return FacultyResolver.createFaculty(input);
  }

  @Patch('/:facultyId')
  updateFaculty(
    @Param('facultyId') facultyId: string,
    @Body(ValidationPipe) input: Partial<Pick<Faculty, 'title' | 'description'>>,
  ) {
    return FacultyResolver.updateFacultyById(facultyId, input);
  }
}

export default createHandler(FacultyHandler);

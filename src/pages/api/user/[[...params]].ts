import { Body, Catch, createHandler, Get, Post, Query, ValidationPipe } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { exceptionHandler } from '@/lib/prisma/error';
import { UserResolver } from '@/lib/prisma/resolvers/user.resolver';
import { GetPresignedUrlInput, VerifyUserEmailInput } from '@/utils/validation/user';

@Catch(exceptionHandler)
class UserHandler {
  @Get('/list')
  _getAllUsers(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return UserResolver.list(+skip, +take, search, sorting);
  }

  @Post('/get-presigned-url')
  _getPreSignedUrl(@Body(ValidationPipe) input: GetPresignedUrlInput) {
    return UserResolver.getPreSignedUrl(input);
  }
  @Post('/confirm-user-email')
  confirmUserEmail(@Body(ValidationPipe) input: VerifyUserEmailInput) {
    return UserResolver.verifyUserEmail(input);
  }
}

export default createHandler(UserHandler);

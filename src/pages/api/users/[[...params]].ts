import {
  Body,
  Catch,
  createHandler,
  Delete,
  Param,
  Post,
  ValidationPipe,
} from 'next-api-decorators';
import { exceptionHandler } from '@/lib/prisma/error';
import { UserResolver } from '@/lib/prisma/resolvers/user.resolver';
import { GetPresignedUrlInput, VerifyUserEmailInput } from '@/utils/validation/user';

@Catch(exceptionHandler)
class UserHandler {
  @Post('/get-presigned-url')
  _getPreSignedUrl(@Body(ValidationPipe) input: GetPresignedUrlInput) {
    return UserResolver.getPreSignedUrl(input);
  }
  @Post('/confirm-user-email')
  confirmUserEmail(@Body(ValidationPipe) input: VerifyUserEmailInput) {
    return UserResolver.verifyUserEmail(input);
  }
  @Delete('/:id')
  _deleteUserById(@Param('id') id: string) {
    return UserResolver.deleteUser(+id);
  }
  @Post('/:id')
  _confirmUserVerificationById(@Param('id') id: string) {
    return UserResolver.confirmuser(+id);
  }
}

export default createHandler(UserHandler);

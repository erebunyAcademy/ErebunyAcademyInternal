import { User } from '@prisma/client';
import {
  Body,
  Catch,
  createHandler,
  Delete,
  Param,
  Post,
  Put,
  ValidationPipe,
} from 'next-api-decorators';
import { CurrentUser } from '@/lib/prisma/decorators/current-user.decorator';
import { exceptionHandler } from '@/lib/prisma/error';
import { AuthMiddleware } from '@/lib/prisma/middlewares/auth-middleware';
import { UserResolver } from '@/lib/prisma/resolvers/user.resolver';
import {
  GetPresignedUrlInput,
  UserProfileFormValidation,
  VerifyUserEmailInput,
} from '@/utils/validation/user';

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
    return UserResolver.deleteUser(id);
  }
  @Post('/:id')
  _confirmUserVerificationById(@Param('id') id: string) {
    return UserResolver.confirmuser(id);
  }

  @AuthMiddleware()
  @Put('/update-profile')
  updateProfile(
    @Body(ValidationPipe) input: UserProfileFormValidation,
    @CurrentUser() user: NonNullable<User>,
  ) {
    return UserResolver.updateProfile(input, user);
  }
}

export default createHandler(UserHandler);

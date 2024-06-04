import {
  Body,
  Catch,
  createHandler,
  Delete,
  Param,
  Patch,
  Post,
  Put,
  ValidationPipe,
} from 'next-api-decorators';
import { User } from 'next-auth';
import { CurrentUser } from '@/lib/prisma/decorators/current-user.decorator';
import { exceptionHandler } from '@/lib/prisma/error';
import { AdminGuard } from '@/lib/prisma/guards/admin';
import { AuthGuard } from '@/lib/prisma/guards/auth';
import { UserResolver } from '@/lib/prisma/resolvers/user.resolver';
import {
  ChangePasswordValidation,
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
  @AdminGuard()
  @Delete('/:id')
  _deleteUserById(@Param('id') id: string) {
    return UserResolver.deleteUser(id);
  }

  @AdminGuard()
  @Post('/:id')
  _confirmUserVerificationById(@Param('id') id: string) {
    return UserResolver.confirmuser(id);
  }

  @AdminGuard()
  @Post('/reject-user/:studentId')
  _rejectUser(
    @Param('studentId') studentId: string,
    @Body(ValidationPipe) input: { message: string },
  ) {
    return UserResolver.rejectUser(studentId, input.message);
  }

  @AuthGuard()
  @Put('/update-profile')
  updateProfile(
    @Body(ValidationPipe) input: UserProfileFormValidation,
    @CurrentUser() user: NonNullable<User>,
  ) {
    return UserResolver.updateProfile(input, user);
  }

  @AuthGuard()
  @Patch('/update-password')
  updatePassword(
    @Body(ValidationPipe) input: ChangePasswordValidation,
    @CurrentUser() user: NonNullable<User>,
  ) {
    return UserResolver.updatePassword(input, user);
  }
}

export default createHandler(UserHandler);

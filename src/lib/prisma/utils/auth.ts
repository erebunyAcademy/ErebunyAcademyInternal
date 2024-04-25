import bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from 'next-api-decorators';
import { ERROR_MESSAGES } from '@/utils/constants/common';
import { UserResolver } from '../resolvers';

export const validateUserPassword = async (email: string, password: string) => {
  try {
    const user = await UserResolver.findUserWithEmail(email);

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.invalidCredentials);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.invalidCredentials);
    }

    if (!user.isVerified) {
      throw new ConflictException(ERROR_MESSAGES.verifyYourEmail);
    }

    return user;
  } catch (e) {
    throw new Error(e as string);
  }
};

export const validateUserByConfirmationCode = async (confirmationCode: number) => {
  try {
    const user = await UserResolver.findUserWithConfirmationCode(confirmationCode);

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.invalidCredentials);
    }

    await UserResolver.verifyUserAccount(user.email);

    return user;
  } catch (e) {
    throw new Error(e as string);
  }
};

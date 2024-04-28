import bcrypt from 'bcrypt';
import { BadRequestException, ConflictException } from 'next-api-decorators';
import { User } from 'next-auth';
import { ERROR_MESSAGES } from '@/utils/constants/common';
import {
  ChangePasswordValidation,
  GetPresignedUrlInput,
  UserProfileFormValidation,
  VerifyPhoneValidation,
  VerifySMSCodeValidation,
  VerifyUserEmailInput,
} from '@/utils/validation/user';
import prisma from '../index';
import { AWSService } from '../services/AWS.service';
import { TwilioService } from '../services/Twillio.service';
import { generateRandomNumber } from '../utils/common';

export class UserResolver {
  static async findUserWithEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async findUserWithConfirmationCode(confirmationCode: number) {
    return prisma.user.findUnique({
      where: { confirmationCode },
    });
  }

  static async verifyUserAccount(email: string) {
    return prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
      },
    });
  }

  static async updateUserProfile(input: UserProfileFormValidation, user: NonNullable<User>) {
    return (
      await prisma.user.update({
        where: { id: user.id },
        data: input,
      })
    ).id;
  }

  static async sendVerificationSMS(input: VerifyPhoneValidation, user: NonNullable<User>) {
    const twilioService = new TwilioService();
    const confirmationCode = generateRandomNumber(4);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        phone: input.phone,
        confirmationCode,
      },
    });

    return twilioService.sendVerificationSMS(input.phone, confirmationCode);
  }

  static async changeUserPassword(
    { confirmPassword, newPassword, currentPassword }: ChangePasswordValidation,
    user: NonNullable<User>,
  ) {
    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      throw new BadRequestException(ERROR_MESSAGES.invalidPassword);
    }

    if (confirmPassword !== newPassword) {
      throw new BadRequestException(ERROR_MESSAGES.passwordDontMatch);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return (
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      })
    ).id;
  }

  static async verifySMSCode(input: VerifySMSCodeValidation, user: NonNullable<User>) {
    console.log(input.code, user);

    if (user.confirmationCode !== +input.code) {
      throw new BadRequestException('Confirmation code is wrong');
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isPhoneVerified: true,
      },
    });

    return true;
  }

  static async getPreSignedUrl(input: GetPresignedUrlInput, user: User) {
    const { imageKey } = input;
    const awsService = new AWSService();

    if (user?.avatar) {
      awsService.deleteAttachment(user.avatar);
    }

    return awsService.getUploadUrl(imageKey);
  }

  static async verifyUserEmail(input: VerifyUserEmailInput) {
    const { code } = input;
    const user = await prisma.user.findUnique({
      where: {
        confirmationCode: code,
      },
    });

    if (!user) {
      throw new ConflictException('Confirmation code is not valid');
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        confirmationCode: null,
      },
    });

    return true;
  }
}

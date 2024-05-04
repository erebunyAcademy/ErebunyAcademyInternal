import { AttachmentTypeEnum } from '@prisma/client';
import bcrypt from 'bcrypt';
import { BadRequestException, ConflictException } from 'next-api-decorators';
import { User } from 'next-auth';
import { SortingType } from '@/api/types/common';
import { ERROR_MESSAGES } from '@/utils/constants/common';
import {
  ChangePasswordValidation,
  GetPresignedUrlInput,
  UserProfileFormValidation,
  VerifyPhoneValidation,
  VerifySMSCodeValidation,
  VerifyUserEmailInput,
} from '@/utils/validation/user';
import { orderBy } from './utils/common';
import prisma from '../index';
import { AWSService } from '../services/AWS.service';
import { generateRandomNumber } from '../utils/common';

export class UserResolver {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    const [count, users] = await Promise.all([
      prisma.user.count({
        where: {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
        select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
        orderBy: orderBy(sorting),
        skip,
        take,
      }),
    ]);

    return {
      count,
      users,
    };
  }

  static async findUserWithEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        admin: {
          select: {
            role: true,
            id: true,
          },
        },
        email: true,
        firstName: true,
        country: true,
        state: true,
        address: true,
        lastName: true,
        role: true,
        attachment: {
          where: {
            type: AttachmentTypeEnum.AVATAR,
          },
          select: {
            key: true,
          },
        },
      },
    });
  }

  static async findUserByEmail(email: string) {
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

    return '';
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

  static async getPreSignedUrl(input: GetPresignedUrlInput) {
    const { imageKey } = input;
    const awsService = new AWSService();

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

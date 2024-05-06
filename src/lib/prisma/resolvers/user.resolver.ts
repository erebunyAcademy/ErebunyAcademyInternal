import { AttachmentTypeEnum } from '@prisma/client';
import bcrypt from 'bcrypt';
import { BadRequestException, ConflictException, NotFoundException } from 'next-api-decorators';
import { User } from 'next-auth';
import { ERROR_MESSAGES } from '@/utils/constants/common';
import {
  ChangePasswordValidation,
  GetPresignedUrlInput,
  UserProfileFormValidation,
  VerifyUserEmailInput,
} from '@/utils/validation/user';
import prisma from '../index';
import { AWSService } from '../services/AWS.service';

export class UserResolver {
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

  static async confirmuser(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User with provided id was not found');
    }
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        isAdminVerified: true,
      },
    });
  }
  static async deleteUser(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User with provided id was not found');
    }

    return prisma.user.delete({
      where: {
        id,
      },
    });
  }

  static async updateProfile(input: UserProfileFormValidation, user: NonNullable<User>) {
    return (
      await prisma.user.update({
        where: { id: user.id },
        data: input,
      })
    ).id;
  }
}

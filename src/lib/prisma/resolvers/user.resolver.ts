import { AttachmentTypeEnum } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ConflictException, NotFoundException } from 'next-api-decorators';
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
import { Email } from '../services/Sendgrid.service';

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
        id: true,
        uniqueUserId: true,
        email: true,
        firstName: true,
        password: true,
        isAdminVerified: true,
        isVerified: true,
        city: true,
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
            id: true,
            key: true,
            type: true,
            mimetype: true,
          },
        },
        student: {
          select: {
            course: {
              select: {
                title: true,
              },
            },
            faculty: {
              select: {
                title: true,
              },
            },
            courseGroup: {
              select: {
                title: true,
              },
            },
          },
        },
        teacher: {
          select: {
            profession: true,
            workPlace: true,
            scientificActivity: true,
          },
        },
      },
    });
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
      throw new ConflictException(ERROR_MESSAGES.invalidConfirmationCode);
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
    // todo, need to add email conf
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.invalidUserId);
    }
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        isAdminVerified: true,
      },
    });

    await Email.approveUserAccountEmail(user.email, user.firstName)
      .then(res => {
        console.log({ approveUserAccountEmail: res });
      })
      .catch(err => {
        console.log({ approveUserAccountEmail: err });
      });
    return true;
  }
  static async deleteUser(id: string) {
    // todo
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.invalidUserId);
    }

    return prisma.user.delete({
      where: {
        id,
      },
    });
  }

  static async updateProfile(input: UserProfileFormValidation, user: NonNullable<User>) {
    const { avatar, avatarMimetype, ...userData } = input;
    const userAvatar = await prisma.attachment.findFirst({
      where: { userId: user.id, type: AttachmentTypeEnum.AVATAR },
    });

    if (!!userAvatar) {
      await prisma.attachment.update({
        where: { id: userAvatar.id },
        data: { mimetype: avatarMimetype, key: avatar },
      });
    } else if (avatar && avatarMimetype) {
      await prisma.attachment.create({
        data: {
          userId: user.id,
          type: AttachmentTypeEnum.AVATAR,
          title: `${user.email} avatar`,
          mimetype: avatarMimetype,
          key: avatar,
        },
      });
    }

    return prisma.user.update({
      where: { id: user.id },
      data: userData,
    });
  }

  static async rejectUser(id: string, message: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.userNotFound);
    }

    await Email.rejectUserAccountEmail(user.email, user.firstName, message);

    return true;
  }

  static async updatePassword(input: ChangePasswordValidation, user: NonNullable<User>) {
    const { currentPassword, newPassword, confirmPassword } = input;

    if (newPassword !== confirmPassword) {
      throw new ConflictException(ERROR_MESSAGES.passwordDontMatch);
    }

    if (currentPassword === newPassword) {
      throw new ConflictException(ERROR_MESSAGES.currentlyUsingThisPassword);
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      throw new ConflictException(ERROR_MESSAGES.invalidCurrentPassword);
    }

    const hashedPassword = await bcrypt.hash(confirmPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return updatedUser.id;
  }
}

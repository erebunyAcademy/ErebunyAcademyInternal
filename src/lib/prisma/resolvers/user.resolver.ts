import { AttachmentTypeEnum } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ConflictException, NotFoundException } from 'next-api-decorators';
import { User } from 'next-auth';
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
        id: true,
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
            studentGrade: {
              select: {
                title: true,
              },
            },
            faculty: {
              select: {
                title: true,
              },
            },
            studentGradeGroup: {
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
    // todo, need to add email conf
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
    // todo
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

  static async updatePassword(input: ChangePasswordValidation, user: NonNullable<User>) {
    const { currentPassword, newPassword, confirmPassword } = input;

    if (newPassword !== confirmPassword) {
      throw new ConflictException("Password don't match");
    }

    if (currentPassword === newPassword) {
      throw new ConflictException('You are currently using this password');
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      throw new ConflictException('Current password is not valid');
    }

    const hashedPassword = await bcrypt.hash(confirmPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return updatedUser.id;
  }
}

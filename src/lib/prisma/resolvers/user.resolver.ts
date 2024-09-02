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
import { mailService } from '../services/email/mailer.service';

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
          select: {
            id: true,
            key: true,
            type: true,
            mimetype: true,
          },
        },
        student: {
          select: {
            studentExams: {
              select: {
                examId: true,
                hasFinished: true,
              },
            },
            id: true,
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
                id: true,
                title: true,
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            profession: true,
            workPlace: true,
            scientificActivity: true,
            subjectTeachers: {
              select: {
                subjectId: true,
              },
            },
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

    await mailService.approveUserAccountEmail(user.email, user.firstName);

    return true;
  }

  static async deleteUser(id: string) {
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
    const {
      avatar,
      avatarMimetype,
      attachmentKey,
      attachmentMimetype,
      teachingSubjectIds,
      ...userData
    } = input;

    const [userAvatar, userAttachment] = await Promise.all([
      prisma.attachment.findFirst({
        where: { userId: user.id, type: AttachmentTypeEnum.AVATAR },
      }),
      prisma.attachment.findFirst({
        where: { userId: user.id, type: AttachmentTypeEnum.FILE },
      }),
    ]);

    const updateOrCreateAttachment = async (
      existingAttachment: any,
      mimetype: string | undefined,
      key: string | undefined,
      type: AttachmentTypeEnum,
      title: string,
    ) => {
      if (existingAttachment) {
        await prisma.attachment.update({
          where: { id: existingAttachment.id },
          data: { mimetype, key },
        });
      } else if (mimetype && key) {
        await prisma.attachment.create({
          data: {
            userId: user.id,
            type,
            title,
            mimetype,
            key,
          },
        });
      }
    };

    await Promise.all([
      updateOrCreateAttachment(
        userAvatar,
        avatarMimetype,
        avatar,
        AttachmentTypeEnum.AVATAR,
        `${user.email} avatar`,
      ),
      updateOrCreateAttachment(
        userAttachment,
        attachmentMimetype,
        attachmentKey,
        AttachmentTypeEnum.FILE,
        `${user.email} file`,
      ),
    ]);

    if (user.teacher) {
      // Step 1: Fetch current SubjectTeacher records for the user
      const existingSubjectTeachers = await prisma.subjectTeacher.findMany({
        where: {
          teacher: {
            userId: user.id,
          },
        },
        select: {
          subjectId: true,
        },
      });

      const existingSubjectIds = existingSubjectTeachers.map(st => st.subjectId);

      // Step 2: Determine which subjects to delete
      const subjectsToDelete = existingSubjectIds.filter(
        subjectId => !teachingSubjectIds.includes(subjectId),
      );

      // Step 3: Determine which subjects to add
      const subjectsToAdd = teachingSubjectIds.filter(
        subjectId => !existingSubjectIds.includes(subjectId),
      );

      // Step 4: Perform deletions and additions
      if (subjectsToDelete.length > 0) {
        await prisma.subjectTeacher.deleteMany({
          where: {
            teacher: {
              userId: user.id,
            },
            subjectId: {
              in: subjectsToDelete,
            },
          },
        });
      }

      if (subjectsToAdd.length > 0) {
        const teacher = await prisma.teacher.findUnique({
          where: { userId: user.id },
          select: { id: true },
        });

        if (!teacher) {
          throw new NotFoundException('Teacher not found');
        }

        await prisma.subjectTeacher.createMany({
          data: subjectsToAdd.map(subjectId => ({
            teacherId: teacher.id,
            subjectId,
          })),
        });
      }
    }

    // Update the user profile data
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

    await mailService.rejectUserAccountEmail(user.email, user.firstName, message);

    const userAttachment = await prisma.attachment.findFirst({
      where: {
        userId: user.id,
        type: AttachmentTypeEnum.FILE,
      },
      select: {
        key: true,
      },
    });

    if (userAttachment?.key) {
      const aws = new AWSService();
      await aws.deleteAttachment(userAttachment?.key);
    }

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

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

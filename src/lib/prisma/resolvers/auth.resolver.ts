import { Attachments, AttachmentTypeEnum, UserRoleEnum } from '@prisma/client';
import bcrypt from 'bcrypt';
import { BadRequestException } from 'next-api-decorators';
import { ERROR_MESSAGES } from '@/utils/constants/common';
import { StudentSignUpValidation, TeacherSignUpValidation } from '@/utils/validation';
import prisma from '..';
import { Email } from '../services/Sendgrid.service';
import { generateRandomNumber } from '../utils/common';

const createUser = async (
  input: TeacherSignUpValidation | StudentSignUpValidation,
  role: UserRoleEnum,
  attachment?: Attachments,
) => {
  const { email, firstName, lastName, password } = input;
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new BadRequestException(ERROR_MESSAGES.userAlreadyExists);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const confirmationCode = generateRandomNumber(6);

  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashedPassword,
      confirmationCode,
      role,
      ...(attachment
        ? {
            attachment: {
              connect: {
                id: attachment.id,
              },
            },
          }
        : {}),
    },
  });

  return user;
};

export class AuthResolver {
  static async teacherSignUp(input: TeacherSignUpValidation) {
    const user = await createUser(input, UserRoleEnum.TEACHER);

    await prisma.teacher.create({
      data: {
        profession: input.profession,
        workPlace: input.workPlace,
        scientificActivity: input.scientificActivity,
        user: { connect: { id: user.id } },
      },
    });

    if (user.confirmationCode && user.firstName) {
      Email.sendConfirmationCodeEmail(user.email, user.confirmationCode, user.firstName)
        .then(res => console.log({ res }))
        .catch(err => console.log({ err }));
    }

    return user;
  }

  static async studentSignUp(input: StudentSignUpValidation) {
    const { facultyId, studentGradeGroupId, studentGradeId } = input;

    const attachment = await prisma.attachments.create({
      data: { ...input.attachment, type: AttachmentTypeEnum.FILE },
    });

    const user = await createUser(input, UserRoleEnum.STUDENT, attachment);

    const createdStudent = await prisma.student.create({
      data: {
        user: { connect: { id: user.id } },
        faculty: facultyId ? { connect: { id: +facultyId } } : (undefined as any),
        studentGradeGroup: { connect: { id: +studentGradeGroupId } },
        studentGrade: { connect: { id: +studentGradeId } },
      },
    });

    await prisma.student.update({
      where: { id: createdStudent.id },
      data: {
        studentGrade: { connect: { id: +studentGradeId } },
        studentGradeGroup: { connect: { id: +studentGradeGroupId } },
        faculty: { connect: { id: +facultyId } },
      },
    });

    if (user.confirmationCode && user.firstName) {
      Email.sendConfirmationCodeEmail(user.email, user.confirmationCode, user.firstName)
        .then(res => console.log({ res }))
        .catch(err => console.log({ err }));
    }

    return user;
  }
}

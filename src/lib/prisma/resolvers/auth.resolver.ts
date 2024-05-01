import { AttachmentTypeEnum, UserRoleEnum } from '@prisma/client';
import bcrypt from 'bcrypt';
import { BadRequestException } from 'next-api-decorators';
import { ERROR_MESSAGES } from '@/utils/constants/common';
import { StudentSignUpValidation, TeacherSignUpValidation } from '@/utils/validation';
import prisma from '..';
import { Email } from '../services/Sendgrid.service';
import { generateRandomNumber } from '../utils/common';

const createUser = async (
  input: TeacherSignUpValidation | StudentSignUpValidation, // Use union type here
  role: UserRoleEnum,
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
      ...((input as StudentSignUpValidation).attachment?.attachmentKey
        ? {
            ...((input as StudentSignUpValidation).attachment.attachmentKey && {
              attachmentId: (input as StudentSignUpValidation).attachment.attachmentKey,
            }),
          }
        : {}),
    },
  });

  return user;
};
export class AuthResolver {
  static async teacherSignUp(input: TeacherSignUpValidation) {
    console.log({ input });
    const user = await createUser(input, UserRoleEnum.TEACHER);

    await prisma.teacher.create({
      data: {
        profession: input.profession,
        workPlace: input.workPlace,
        scientificActivity: input.scientificActivity,
        userId: user.id,
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
    const { facultyId, studentGradeGroupId, studentGradeId, attachment } = input;

    const user = await createUser(input, UserRoleEnum.STUDENT);

    await prisma.attachment.create({
      data: {
        userId: user.id,
        mimetype: attachment.mimetype,
        type: AttachmentTypeEnum.FILE,
        title: attachment.title,
        key: attachment.key,
      },
    });

    await prisma.student.create({
      data: {
        userId: user.id,
        facultyId: +facultyId,
        studentGradeId: +studentGradeId,
        studentGradeGroupId: +studentGradeGroupId,
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

import bcrypt from "bcrypt";
import { BadRequestException } from "next-api-decorators";
import { ERROR_MESSAGES } from "@/utils/constants/common";
import { SignUpValidation } from "@/utils/validation";
import prisma from "..";
import { generateRandomNumber } from "../utils/common";
import { Student, Teacher, UserRoleEnum } from "@prisma/client";
import { Email } from "../services/Sendgrid.service";

export class AuthResolver {
  static async signUp(input: SignUpValidation) {
    const { email, password, userType, confirmPassword, ...rest } = input;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new BadRequestException(ERROR_MESSAGES.userAlreadyExists);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationCode = generateRandomNumber(6);

    const role =
      userType === UserRoleEnum.STUDENT
        ? UserRoleEnum.STUDENT
        : UserRoleEnum.TEACHER;

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        confirmationCode,
        role,
      },
    });

    Email.sendConfirmationCodeEmail(
      user.email,
      confirmationCode,
      rest.firstName
    )
      .then((res) => console.log({ res }))
      .catch((err) => console.log({ err }));

    if (role === UserRoleEnum.TEACHER) {
      const teacherData = {
        profession: rest.profession!,
        workPlace: rest.workPlace!,
        scientificActivity: rest.scientificActivity!,
      };

      await prisma.teacher.create({
        data: {
          ...teacherData,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }

    return user;
  }
}

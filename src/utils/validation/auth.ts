import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class SignInFormValidation {
  @IsEmail({}, { message: 'notValidEmailMessage' })
  @IsNotEmpty({ message: 'emailMessage' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'requiredPasswordMessage' })
  password: string;
}

export class AttachmentValidation {
  @IsNotEmpty({ message: 'Mime type is required' })
  mimetype: string;

  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Key is required' })
  key: string;

  @IsString()
  @IsNotEmpty({ message: 'Key is required' })
  attachmentKey: string;
}

export class UserSignupValidation {
  @IsString()
  @IsNotEmpty({ message: 'firstNameMessage' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'lastNameMessage' })
  lastName: string;

  @IsEmail({}, { message: 'notValidEmailMessage' })
  @IsString()
  @IsNotEmpty({ message: 'emailMessage' })
  email: string;

  @IsString()
  @Length(6, 20, { message: 'passwordValidation' })
  @IsNotEmpty({ message: 'requiredPasswordMessage' })
  password: string;

  @IsString()
  @Length(6, 20, { message: 'passwordValidation' })
  @IsNotEmpty({ message: 'passwordConfirmationMessage' })
  confirmPassword: string;
}

export class TeacherSignUpValidation extends UserSignupValidation {
  @IsString()
  @IsNotEmpty({ message: 'professionMessage' })
  profession: string;

  @IsString()
  @IsOptional()
  // @IsNotEmpty({ message: 'workingPlaceMessage' })
  workPlace: string;

  @IsString()
  // @IsNotEmpty({ message: 'scientificActivityMessage' })
  @IsOptional()
  scientificActivity: string;

  @IsString()
  @IsNotEmpty({ message: 'teachingSubjectMessage' })
  teachingSubjectId: string;
}

export class StudentSignUpValidation extends UserSignupValidation {
  @IsString()
  @IsNotEmpty({ message: 'courseMessage' })
  courseId: string;

  @IsString()
  @IsOptional()
  courseGroupId?: string;

  @IsString()
  @IsNotEmpty({ message: 'facultyMessage' })
  facultyId: string;

  @ValidateNested()
  attachment: AttachmentValidation;
}

export class ForgotPasswordStep1Validation {
  @IsEmail({}, { message: 'notValidEmailMessage' })
  @IsNotEmpty({ message: 'emailMessage' })
  email: string;
}

export class ForgotPasswordStep2Validation {
  @IsString()
  @IsNotEmpty()
  @Length(4)
  otpPassword: string;
}

export class ResendEmailValidation extends ForgotPasswordStep1Validation {
  @IsString()
  @IsNotEmpty({ message: 'firstNameMessage' })
  firstName: string;
}

export class ForgotPasswordStep3Validation {
  @IsString()
  @IsNotEmpty({ message: 'newPasswordMessage' })
  @Length(6, 20, { message: 'passwordValidation' })
  newPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'passwordConfirmationMessage' })
  @Length(6, 20, { message: 'passwordValidation' })
  confirmPassword: string;

  @IsNumber()
  @IsNotEmpty()
  confirmationCode: number;
}

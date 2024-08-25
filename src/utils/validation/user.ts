import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UserProfileFormValidation {
  @IsString()
  @IsNotEmpty({ message: 'firstNameMessage' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'lastNameMessage' })
  lastName: string;

  @IsEmail({}, { message: 'notValidEmailMessage' })
  @IsNotEmpty({ message: 'emailMessage' })
  email: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  avatarMimetype?: string;

  @IsString()
  @IsOptional()
  attachmentKey?: string;

  @IsString()
  @IsOptional()
  attachmentMimetype?: string;
}

export class VerifyPhoneValidation {
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class VerifySMSCodeValidation {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class ChangePasswordValidation {
  @IsString()
  @IsNotEmpty({ message: 'currentPasswordMessage' })
  currentPassword: string;

  @IsString()
  @Length(6, 20, { message: 'passwordValidation' })
  @IsNotEmpty({ message: 'newPasswordMessage' })
  newPassword: string;

  @IsString()
  @Length(6, 20, { message: 'passwordValidation' })
  @IsNotEmpty({ message: 'passwordConfirmationMessage' })
  confirmPassword: string;
}

export class GetPresignedUrlInput {
  @IsString()
  @IsNotEmpty({ message: 'Image key is required' })
  imageKey: string;
}

export class VerifyUserEmailInput {
  @IsNumber()
  @IsNotEmpty({ message: 'Code is required' })
  code: number;
}

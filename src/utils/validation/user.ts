import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-transformer';

export class UserProfileFormValidation {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
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
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm password is required' })
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

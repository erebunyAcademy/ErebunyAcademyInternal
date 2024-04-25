import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UserProfileFormValidation {
  @IsString()
  @IsNotEmpty({ message: "First name is required" })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: "Last name is required" })
  lastName: string;

  @IsEmail()
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  country: string;

  @IsString()
  state: string;

  @IsString()
  avatar: string;

  @IsString()
  city: string;
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
  @IsNotEmpty({ message: "Current password is required" })
  currentPassword: string;

  @IsString()
  @IsNotEmpty({ message: "New password is required" })
  newPassword: string;

  @IsString()
  @IsNotEmpty({ message: "Confirm password is required" })
  confirmPassword: string;
}

export class GetPresignedUrlInput {
  @IsString()
  @IsNotEmpty({ message: "Image key is required" })
  imageKey: string;
}

export class VerifyUserEmailInput {
  @IsNumber()
  @IsNotEmpty({ message: "Code is required" })
  code: number;
}

import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class TeacherSignUpValidation {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 20)
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm password is required' })
  @Length(6, 20)
  confirmPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Profession is required' })
  profession: string;

  @IsString()
  @IsNotEmpty({ message: 'Profession is required' })
  faculty: string;

  @IsString()
  @IsNotEmpty({ message: 'Working place is required' })
  workPlace: string;

  @IsString()
  @IsNotEmpty({ message: 'Scientific activity is required' })
  scientificActivity: string;
}

export class StudentSignUpValidation {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 20)
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm password is required' })
  @Length(6, 20)
  confirmPassword: string;
}

export class ForgotPasswordStep1Validation {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
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
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;
}

export class ForgotPasswordStep3Validation {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  confirmPassword: string;

  @IsNumber()
  @IsNotEmpty()
  confirmationCode: number;
}

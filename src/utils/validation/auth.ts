import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class SignUpValidation {
  @IsString()
  @IsNotEmpty({ message: "First name is required" })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: "Last name is required" })
  lastName: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  @Length(6, 20)
  password: string;
}

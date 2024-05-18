import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEditSubjectValidation {
  @IsString()
  @IsNotEmpty({ message: 'Subject title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  id?: string;
}

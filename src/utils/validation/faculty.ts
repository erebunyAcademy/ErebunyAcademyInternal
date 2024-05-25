import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEditFacultyValidation {
  @IsString()
  @IsNotEmpty({ message: 'facultyTitleMessage' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  id?: string;
}

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEditFacultyValidation {
  @IsString()
  @IsNotEmpty({ message: 'Faculty title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  id?: string;
}

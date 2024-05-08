import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEditFacultyValidation {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsOptional({ message: 'Description is required' })
  description: string;

  @IsString()
  @IsOptional()
  id?: string;
}

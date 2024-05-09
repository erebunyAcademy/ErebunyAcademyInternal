import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEditStudentGradeGroupValidation {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  id?: string;
}

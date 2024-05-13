import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEditStudentGradeValidation {
  @IsString()
  @IsNotEmpty({ message: 'Student grade title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  facultyId: string;
}

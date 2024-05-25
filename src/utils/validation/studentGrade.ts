import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEditStudentGradeValidation {
  @IsString()
  @IsNotEmpty({ message: 'studentGradeTitleMessage' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty({ message: 'facultyMessage' })
  facultyId: string;
}

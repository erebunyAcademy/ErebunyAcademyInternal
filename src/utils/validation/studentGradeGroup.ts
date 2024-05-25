import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEditStudentGradeGroupValidation {
  @IsString()
  @IsNotEmpty({ message: 'studentGroupTitleMessage' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty({ message: 'studentGradeMessage' })
  studentGradeId: string;
}

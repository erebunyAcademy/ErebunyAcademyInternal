import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEditStudentGradeGroupValidation {
  @IsString()
  @IsNotEmpty({ message: 'Student grade group title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty({ message: 'Student grade is required' })
  studentGradeId: string;
}

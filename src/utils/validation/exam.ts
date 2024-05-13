import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ExamValidation {
  @IsString()
  @IsNotEmpty({ message: 'Exam title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Faculty is required' })
  facultyId: string;

  @IsString()
  @IsNotEmpty({ message: 'Student grade is required' })
  studentGradeId: string;

  @IsString()
  @IsNotEmpty({ message: 'Student grade is required' })
  studentGradeGroupId: string;

  @IsArray()
  @IsNotEmpty({ message: 'Students are required' })
  studentIds: string[];
}

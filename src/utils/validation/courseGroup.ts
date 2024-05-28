import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEditCourseGroupValidation {
  @IsString()
  @IsNotEmpty({ message: 'courseGroupTitleMessage' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty({ message: 'courseMessage' })
  courseId: string;
}

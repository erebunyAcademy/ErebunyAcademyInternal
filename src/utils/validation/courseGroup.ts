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

  @IsString()
  @IsNotEmpty()
  gradeLevelId: string;
}

export class SelectStudentCourseGroupValidation {
  @IsString()
  @IsNotEmpty({ message: 'You need to select course group' })
  courseGroupId: string;

  @IsString()
  @IsNotEmpty({ message: 'You need to select course group' })
  courseId: string;
}

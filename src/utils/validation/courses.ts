import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEditCourseValidation {
  @IsString()
  @IsNotEmpty({ message: 'courseTitleMessage' })
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

import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStudentValidation {
  @IsString()
  @IsNotEmpty()
  courseGroupId: string;
}

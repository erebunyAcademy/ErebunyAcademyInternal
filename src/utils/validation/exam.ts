import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ExamValidation {
  @IsString()
  @IsNotEmpty({ message: 'Exam title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Exam description is required' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: "Faculty's required" })
  facultyId: string;

  @IsArray()
  @IsNotEmpty({ message: 'You need to select students' })
  selectedUsersIds: string[];
}

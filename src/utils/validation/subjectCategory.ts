import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEditSubjectCategoryValidation {
  @IsString()
  @IsNotEmpty({ message: 'subjectCategoryTitleMessage' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty({ message: 'subjectMessage' })
  subjectId: string;
}

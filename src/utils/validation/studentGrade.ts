import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from '../../../public/node_modules/.pnpm/class-validator@0.14.1/node_modules/class-validator/types';

export class CreateEditStudentGradeValidation {
  @IsString()
  @IsNotEmpty({ message: 'Student grade title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  facultyId: string;
}

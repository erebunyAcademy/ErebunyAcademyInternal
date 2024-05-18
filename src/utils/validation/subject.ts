import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from '../../../public/node_modules/.pnpm/class-validator@0.14.1/node_modules/class-validator/types';

export class CreateEditSubjectValidation {
  @IsString()
  @IsNotEmpty({ message: 'Subject title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  id?: string;
}

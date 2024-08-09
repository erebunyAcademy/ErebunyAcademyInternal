import 'reflect-metadata';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class StudentMarkDataValidation {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  isPresent: boolean;

  @IsString()
  @IsOptional()
  mark: string;
}

export class CreateStudentAttentdanceRecordValidation {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentMarkDataValidation)
  students: StudentMarkDataValidation[];

  @IsArray()
  @Type(() => String)
  thematicPlanIds: string[];
}

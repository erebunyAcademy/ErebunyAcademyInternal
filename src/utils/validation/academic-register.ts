import 'reflect-metadata';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class BaseAttendanceRecordValidation {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  isPresent: boolean;

  @IsString()
  @IsOptional()
  mark?: string;
}

export class StudentMarkDataValidation extends BaseAttendanceRecordValidation {
  @IsString()
  @IsNotEmpty()
  attendantId: string;
}

export class CreateStudentAttendanceRecordValidation {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BaseAttendanceRecordValidation)
  students: BaseAttendanceRecordValidation[];

  @IsArray()
  @Type(() => String)
  thematicPlanIds: string[];

  @IsBoolean()
  @IsOptional()
  isCompletedLesson?: boolean;
}

export class GetStudentAcademicRegisterDataValidation {
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;
}

export class UpdateStudentAttendanceRecordsValidation {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => StudentMarkDataValidation)
  attendantRecords: StudentMarkDataValidation[];
}

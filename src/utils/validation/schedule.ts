import 'reflect-metadata';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class CourseClassValidation {
  @IsString()
  @IsNotEmpty()
  totalHours: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClassDescriptionRow)
  classDescriptionRow: ClassDescriptionRow[];
}

export class ClassDescriptionRow {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  hour: string;
}

export class LinkValidation {
  @IsString()
  @IsOptional()
  @IsUrl()
  link: string;
}

export class AttachmentValidation {
  @IsString()
  @IsOptional()
  key: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  mimetype: string;
}

export class CreateEditScheduleValidation {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  totalHours: string;

  @IsString()
  @IsOptional()
  startDayDate: string;

  @IsString()
  @IsOptional()
  examDate: string;

  @IsString()
  @IsOptional()
  endDayDate: string;

  @IsBoolean()
  @IsNotEmpty()
  isAssessment: boolean;

  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @ValidateNested({ each: true })
  @Type(() => CourseClassValidation)
  theoreticalClass: CourseClassValidation;

  @ValidateNested({ each: true })
  @Type(() => CourseClassValidation)
  practicalClass: CourseClassValidation;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkValidation)
  links: LinkValidation[];

  @IsArray()
  @IsOptional()
  attachments: AttachmentValidation[];
}

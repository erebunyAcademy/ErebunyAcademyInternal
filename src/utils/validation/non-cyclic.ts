import 'reflect-metadata';
import { ScheduleExamTypeEnum, WeekDayEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
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

export class AvailableDaysValidation {
  @IsEnum(WeekDayEnum)
  @IsNotEmpty()
  dayOfWeek: WeekDayEnum;

  @IsNumber()
  @IsNotEmpty()
  lessonOfTheDay: number;
}

export class CreateEditNonCylicScheduleValidation {
  @IsString()
  @IsOptional()
  id?: string;

  @IsEnum(ScheduleExamTypeEnum)
  @IsNotEmpty()
  @IsString()
  examType: ScheduleExamTypeEnum;

  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsNotEmpty()
  courseGroupId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  totalHours: string;

  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailableDaysValidation)
  availableDays: AvailableDaysValidation[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkValidation)
  links: LinkValidation[];

  @IsArray()
  @IsOptional()
  attachments?: AttachmentValidation[];
}

export class AddEditThematicPlanValidation {
  @ValidateNested({ each: true })
  @Type(() => CourseClassValidation)
  theoreticalClass: CourseClassValidation;

  @ValidateNested({ each: true })
  @Type(() => CourseClassValidation)
  practicalClass: CourseClassValidation;
}

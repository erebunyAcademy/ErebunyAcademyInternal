import {
  ExamStatusEnum,
  LanguageTypeEnum,
  TestQuestionLevelEnum,
  TestQuestionTypeEnum,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AtLeastOneCorrectAnswer } from './custom';

class Answer {
  @IsString()
  @IsNotEmpty({ message: 'Answer text is required' })
  title: string;

  @IsBoolean()
  @IsOptional()
  isRightAnswer: boolean;
}

class Question {
  @IsString()
  @IsNotEmpty({ message: 'Question type is required' })
  type: TestQuestionTypeEnum;

  @IsString()
  @IsNotEmpty({ message: 'Skill level is required' })
  skillLevel: TestQuestionLevelEnum;

  @IsString()
  @IsNotEmpty({ message: 'Question text is required' })
  title: string;

  @IsEnum(LanguageTypeEnum)
  @IsNotEmpty({ message: 'Language is required' })
  lang: LanguageTypeEnum;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Answer)
  @AtLeastOneCorrectAnswer({ message: 'At least one answer must be marked as correct' })
  options: Answer[];

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  topic?: string;

  @IsString()
  @IsOptional()
  subTopic?: string;
}

export class TestQuestionValidation {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Question)
  questions: Question[];
}

export class CreateExamValidation {
  @IsString()
  @IsNotEmpty({ message: 'examDurationMessage' })
  duration: string;

  @IsString()
  @IsNotEmpty({ message: 'subjectMessage' })
  subjectId: string;

  @IsString()
  @IsNotEmpty({ message: 'facultyMessage' })
  facultyId: string;

  @IsString()
  @IsNotEmpty({ message: 'courseMessage' })
  courseId: string;

  @IsString()
  @IsNotEmpty({ message: 'courseGroupMessage' })
  courseGroupId: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'studentsRequiredMessage' })
  @IsString({ each: true })
  studentIds: string[];
}

export class ExamValidation {
  @IsString()
  @IsNotEmpty({ message: 'Exam title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsNotEmpty({ message: 'Tests are required' })
  testQuestionIds: string[];
}

export class OptionalExamValidation {
  @IsString()
  @IsOptional({ message: 'Exam title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional({ message: 'Tests are required' })
  testQuestionIds: string[];
}

export class UpdateExamStatusValidation {
  @IsString()
  @IsEnum(ExamStatusEnum)
  status: ExamStatusEnum;
}

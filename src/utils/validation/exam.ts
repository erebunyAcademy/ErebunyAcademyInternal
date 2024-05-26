import { LanguageTypeEnum, TestQuestionLevelEnum, TestQuestionTypeEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
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

  @IsString()
  @IsNotEmpty({ message: 'Answer id is required' })
  optionId: string;
}

class Question {
  @IsString()
  @IsNotEmpty({ message: 'Question type is required' })
  questionType: TestQuestionTypeEnum;

  @IsString()
  @IsNotEmpty({ message: 'Skill level is required' })
  skillLevel: TestQuestionLevelEnum;

  @IsString()
  @IsNotEmpty({ message: 'Question text is required' })
  questionText: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Answer)
  @AtLeastOneCorrectAnswer({ message: 'At least one answer must be marked as correct' })
  answers: Answer[];
}

export class TestQuestionValidation {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Question)
  questions: Question[];
}

export class ExamValidation {
  @IsString()
  @IsNotEmpty({ message: 'Exam title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Faculty is required' })
  facultyId: string;

  @IsString()
  @IsNotEmpty({ message: 'Student grade is required' })
  studentGradeId: string;

  @IsString()
  @IsNotEmpty({ message: 'Student grade group is required' })
  studentGradeGroupId: string;

  @IsArray()
  @IsNotEmpty({ message: 'Students are required' })
  studentIds: string[];

  @IsString()
  @IsNotEmpty({ message: 'Subject is required' })
  subjectId: string;

  @IsEnum(LanguageTypeEnum)
  @IsNotEmpty({ message: 'Language is required' })
  language: LanguageTypeEnum;

  @IsArray()
  @IsNotEmpty({ message: 'Tests are required' })
  testQuestionIds: string[];
}

'use client';
import React from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, IconButton, Stack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { TestQuestionLevelEnum, TestQuestionTypeEnum } from '@prisma/client';
import { useParams } from 'next/navigation';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import { FormInput, SelectLabel } from '@/components/atoms';
import AnswersControl from '@/components/molecules/AnswerControl';
import { ExamValidation, TestQuestionValidation } from '@/utils/validation/exam';

const questionTypes = [
  {
    id: TestQuestionTypeEnum.RADIO,
    type: 'Single',
  },
  {
    id: TestQuestionTypeEnum.CHECKBOX,
    type: 'Multiple',
  },
];

const skillLevels = [
  {
    id: TestQuestionLevelEnum.BEGINNER,
    skillLevel: 'Beginner',
  },
  {
    id: TestQuestionLevelEnum.INTERMEDIATE,
    skillLevel: 'Intermediate',
  },
  {
    id: TestQuestionLevelEnum.ADVANCED,
    skillLevel: 'Advanced',
  },
];

const initValue = {
  questionText: '',
  questionType: TestQuestionTypeEnum.CHECKBOX,
  skillLevel: TestQuestionLevelEnum.BEGINNER,
  answers: [{ title: '', isRightAnswer: false, optionId: v4() }],
};

const resolver = classValidatorResolver(ExamValidation);

const CreateTestQuestions = () => {
  const params = useParams();
  const { control, watch, handleSubmit } = useForm<TestQuestionValidation>({
    resolver,
    defaultValues: {
      questions: [initValue],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  console.log(params);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box my="50px">
        <Heading textAlign="center">Create Exam Questions</Heading>
        {questionFields.map((question, questionIndex) => {
          const questionType = watch(`questions.${questionIndex}.questionType`);
          return (
            <Stack
              key={question.id}
              borderWidth="1px"
              borderRadius="lg"
              px="24px"
              py="32px"
              mt="20px">
              <Flex justifyContent="space-between" alignItems="center">
                <Heading size="md">Question {questionIndex + 1}</Heading>
                {questionIndex > 0 && (
                  <IconButton
                    colorScheme="red"
                    aria-label="Delete question"
                    icon={<DeleteIcon />}
                    onClick={() => removeQuestion(questionIndex)}
                  />
                )}
              </Flex>
              <Flex gap="30px">
                <Controller
                  name={`questions.${questionIndex}.questionText`}
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <FormInput
                      isRequired
                      placeholder="Question"
                      name={name}
                      type="text"
                      formLabelName="Question"
                      value={value}
                      handleInputChange={onChange}
                    />
                  )}
                />
                <Controller
                  name={`questions.${questionIndex}.questionType`}
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <SelectLabel
                      name={name}
                      options={questionTypes}
                      labelName="Question type"
                      valueLabel="id"
                      nameLabel="type"
                      onChange={onChange}
                      value={value}
                    />
                  )}
                />
                <Controller
                  name={`questions.${questionIndex}.skillLevel`}
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <SelectLabel
                      name={name}
                      options={skillLevels}
                      labelName="Skill level"
                      valueLabel="id"
                      nameLabel="skillLevel"
                      onChange={onChange}
                      value={value}
                    />
                  )}
                />
              </Flex>

              <AnswersControl
                control={control}
                questionIndex={questionIndex}
                questionType={questionType}
              />

              {questionIndex === questionFields.length - 1 && (
                <Button onClick={() => appendQuestion(initValue)} width="50%">
                  Add Question
                </Button>
              )}
            </Stack>
          );
        })}
        <Button colorScheme="teal" type="submit" width="50%">
          Submit Exam
        </Button>
      </Box>
    </form>
  );
};

export default CreateTestQuestions;

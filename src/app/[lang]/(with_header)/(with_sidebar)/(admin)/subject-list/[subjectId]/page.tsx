'use client';
import React, { useEffect, useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, HStack, IconButton, Stack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { TestQuestionLevelEnum, TestQuestionTypeEnum } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { TestQuestionService } from '@/api/services/test-question.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import AnswersControl from '@/components/molecules/AnswerControl';
import ExamsUploadByExcel, { UploadedExcelData } from '@/components/organisms/ExamsUploadByExcel';
import { Maybe } from '@/utils/models/common';
import { TestQuestionValidation } from '@/utils/validation/exam';

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
  title: '',
  type: TestQuestionTypeEnum.CHECKBOX,
  subjectId: '',
  skillLevel: TestQuestionLevelEnum.BEGINNER,
  options: [{ title: '', isRightAnswer: false }],
};

const resolver = classValidatorResolver(TestQuestionValidation);

const CreateTestQuestions = ({ params }: { params: { subjectId: string } }) => {
  const [excelData, setExcelData] = useState<UploadedExcelData>(null);
  const { control, watch, handleSubmit, reset } = useForm<TestQuestionValidation>({
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

  const { mutate: createTestQuestions } = useMutation({
    mutationFn: (params: { subjectId: string; input: TestQuestionValidation }) => {
      return TestQuestionService.createTestQuestions(params.subjectId, params.input);
    },
  });

  const onSubmit = (data: TestQuestionValidation) => {
    createTestQuestions({ subjectId: params?.subjectId! || '', input: data });
  };

  useEffect(() => {
    if (excelData) {
      reset({
        questions: excelData.map(item => ({
          title: item.question as string,
          type:
            item.answers?.length || 0 > 1
              ? TestQuestionTypeEnum.CHECKBOX
              : TestQuestionTypeEnum.RADIO,
          skillLevel: item.level as TestQuestionLevelEnum,
          options: Array.isArray(item.options)
            ? item.options.map(opt => {
                if (!opt) {
                  return {};
                }
                const arr = Object.entries(opt);
                return {
                  title: arr[0][1] as string,
                  isRightAnswer: !!(item.answers as Maybe<string[]>)?.includes(arr[0][0]),
                };
              })
            : [],
        })),
      });
      setExcelData(null);
    }
  }, [excelData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box my="50px">
        <HStack spacing={10}>
          <Heading textAlign="center">Create Exam Questions</Heading>
          <ExamsUploadByExcel setUploadedResults={setExcelData} />
        </HStack>
        {questionFields.map((question, questionIndex) => {
          const questionType = watch(`questions.${questionIndex}.type`);
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
                  name={`questions.${questionIndex}.title`}
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
                  name={`questions.${questionIndex}.type`}
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

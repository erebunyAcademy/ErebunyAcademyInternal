'use client';
import React, { useEffect, useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, HStack, IconButton, Stack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { TestQuestionLevelEnum, TestQuestionTypeEnum } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { TestQuestionService } from '@/api/services/test-question.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import AnswersControl from '@/components/molecules/AnswerControl';
import ExamsUploadByExcel, { UploadedExcelData } from '@/components/organisms/ExamsUploadByExcel';
import { Locale } from '@/i18n';
import { ROUTE_SUBJECTS } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
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

const CreateTestQuestions = () => {
  const params: Maybe<{ lang: Locale; subjectId: string }> = useParams();
  const router = useRouter();
  const t = useTranslations();
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

  const { mutate, isPending } = useMutation<boolean, { message: string }, TestQuestionValidation>({
    mutationFn: data => TestQuestionService.createTestQuestions(data, params?.subjectId as string),
  });

  const onSubmit: SubmitHandler<TestQuestionValidation> = data => {
    mutate(data, {
      onSuccess: () => {
        router.push(languagePathHelper(params?.lang || 'am', ROUTE_SUBJECTS));
      },
    });
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
          <Heading textAlign="center">{t('createExamQuestions')}</Heading>
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
                <Heading size="md">
                  {t('question')} {questionIndex + 1}
                </Heading>
                {questionIndex > 0 && (
                  <IconButton
                    colorScheme="red"
                    aria-label={t('deleteQuestion')}
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
                      placeholder={t('question')}
                      name={name}
                      type="text"
                      formLabelName={t('question')}
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
                      labelName={t('questionType')}
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
                      labelName={t('skillLevel')}
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
                  {t('addQuestion')}
                </Button>
              )}
            </Stack>
          );
        })}
        <Button colorScheme="teal" type="submit" width="50%" isLoading={isPending}>
          {t('submitTestQuestions')}
        </Button>
      </Box>
    </form>
  );
};

export default CreateTestQuestions;

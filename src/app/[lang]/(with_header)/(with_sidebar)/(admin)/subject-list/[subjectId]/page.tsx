'use client';
import React, { useEffect, useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, HStack, IconButton, Stack, useToast } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { LanguageTypeEnum, TestQuestionLevelEnum, TestQuestionTypeEnum } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { TestQuestionService } from '@/api/services/test-question.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import FormTextarea from '@/components/atoms/FormTextarea';
import AnswersControl from '@/components/molecules/AnswerControl';
import ExamsUploadByExcel, { UploadedExcelData } from '@/components/organisms/ExamsUploadByExcel';
import SimpleTable from '@/components/organisms/SimpleTable';
import { Maybe } from '@/utils/models/common';
import { TestQuestionListModel } from '@/utils/models/test-question.model';
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
    id: TestQuestionLevelEnum.EASY,
    skillLevel: 'Easy',
  },
  {
    id: TestQuestionLevelEnum.MEDIUM,
    skillLevel: 'Medium',
  },
  {
    id: TestQuestionLevelEnum.HARD,
    skillLevel: 'Hard',
  },
];

const initValue = {
  title: '',
  type: TestQuestionTypeEnum.CHECKBOX,
  subjectId: '',
  skillLevel: TestQuestionLevelEnum.EASY,
  options: [{ title: '', isRightAnswer: false }],
};

const resolver = classValidatorResolver(TestQuestionValidation);

const CreateTestQuestions = ({
  params: { subjectId },
  searchParams: { language },
}: {
  params: { subjectId: string };
  searchParams: { language: LanguageTypeEnum };
}) => {
  const t = useTranslations();
  const toast = useToast();
  const [excelData, setExcelData] = useState<UploadedExcelData>(null);

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<TestQuestionValidation>({
    resolver,
    defaultValues: {
      questions: [{ ...initValue, lang: language }],
    },
  });

  const { data: testQuestionQueryData, refetch } = useQuery<TestQuestionListModel>({
    queryKey: ['testQuestion', subjectId, language],
    queryFn: TestQuestionService.getTestQuestionsBySubjectId.bind(null, subjectId, language),
    enabled: !!subjectId,
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
    mutationFn: data => TestQuestionService.createTestQuestions(data, subjectId),
  });

  const onSubmit: SubmitHandler<TestQuestionValidation> = data => {
    mutate(data, {
      onSuccess: () => {
        toast({ title: 'Success', status: 'success' });
        reset({ questions: [initValue] });
        refetch();
      },
    });
  };

  useEffect(() => {
    if (excelData) {
      reset({
        questions: excelData.map(item => ({
          title: item.question as string,
          category: item.category as string | undefined,
          topic: item.topic as string | undefined,
          subTopic: item.subtopic as string | undefined,
          type:
            (item.answers?.length || 0) > 1
              ? TestQuestionTypeEnum.CHECKBOX
              : TestQuestionTypeEnum.RADIO,
          skillLevel:
            ((item.level as string)?.toUpperCase()?.trim() as TestQuestionLevelEnum) ||
            TestQuestionLevelEnum.EASY,
          lang: language,
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
  }, [excelData, language, reset]);

  const testQuestionCcolumnHelper = createColumnHelper<TestQuestionListModel>();

  const testQuestionColumns = [
    testQuestionCcolumnHelper.accessor('category', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('category'),
    }),
    testQuestionCcolumnHelper.accessor('topic', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('topic'),
    }),
    testQuestionCcolumnHelper.accessor('subTopic', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('subTopic'),
    }),
    testQuestionCcolumnHelper.accessor('title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('question'),
    }),
    testQuestionCcolumnHelper.accessor('options', {
      id: uuidv4(),
      cell: info =>
        (info.getValue() as any).map(({ title }: { title: string }) => (
          <Box key={title} my={2}>
            {title}
          </Box>
        )),
      header: t('answers'),
    }),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box my={{ base: '25px', md: '50px' }}>
        <HStack>
          <Flex overflowY="auto" flexDirection="column" width="100%" mb={100} maxH={800}>
            <SimpleTable
              columns={testQuestionColumns as any}
              data={testQuestionQueryData || []}
              title="testQuestions"
            />
          </Flex>
        </HStack>
        <HStack spacing={10}>
          <Heading textAlign="center" fontSize={{ base: '22px', md: '28px' }}>
            {t('createExamQuestions')}
          </Heading>
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
                    size={{ base: 'sm', lg: 'md' }}
                    colorScheme="red"
                    aria-label={t('deleteQuestion')}
                    icon={<DeleteIcon />}
                    onClick={() => removeQuestion(questionIndex)}
                  />
                )}
              </Flex>
              <Flex
                mb="15px"
                gap={{ base: '20px', lg: '30px' }}
                flexDirection={{ base: 'column', lg: 'row' }}>
                <Controller
                  name={`questions.${questionIndex}.title`}
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <FormTextarea
                      isRequired
                      placeholder="question"
                      name={name}
                      formLabelName="question"
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
                      isRequired
                      name={name}
                      options={questionTypes}
                      labelName="questionType"
                      valueLabel="id"
                      nameLabel="type"
                      onChange={onChange}
                      value={value}
                      isDisabled={
                        watch(`questions.${questionIndex}.options`).filter(
                          item => item.isRightAnswer,
                        ).length > 1
                      }
                    />
                  )}
                />
                <Controller
                  name={`questions.${questionIndex}.skillLevel`}
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <SelectLabel
                      isRequired
                      name={name}
                      options={skillLevels}
                      labelName="skillLevel"
                      valueLabel="id"
                      nameLabel="skillLevel"
                      onChange={onChange}
                      value={value}
                    />
                  )}
                />
              </Flex>
              <Controller
                name={`questions.${questionIndex}.category`}
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <FormInput
                    placeholder="category"
                    name={name}
                    type="text"
                    value={value}
                    handleInputChange={onChange}
                    formLabelName={t('category')}
                  />
                )}
              />
              <Controller
                name={`questions.${questionIndex}.topic`}
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <FormInput
                    placeholder="topic"
                    name={name}
                    type="text"
                    value={value}
                    handleInputChange={onChange}
                    formLabelName={t('topic')}
                  />
                )}
              />
              <Controller
                name={`questions.${questionIndex}.subTopic`}
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <FormInput
                    placeholder="subTopic"
                    name={name}
                    type="text"
                    value={value}
                    handleInputChange={onChange}
                    formLabelName={t('subTopic')}
                  />
                )}
              />
              <AnswersControl
                control={control}
                questionIndex={questionIndex}
                questionType={questionType}
              />
              {questionIndex === questionFields.length - 1 && (
                <Button
                  mt={5}
                  onClick={() => appendQuestion({ ...initValue, lang: language })}
                  width="50%"
                  fontSize={{ base: '16px', lg: '20px' }}>
                  {t('addQuestion')}
                </Button>
              )}
            </Stack>
          );
        })}
        <Flex justifyContent="flex-end">
          <Button
            mt="15px"
            colorScheme="teal"
            type="submit"
            isLoading={isPending}
            fontSize={{ base: '16px', lg: '20px' }}
            overflowWrap="break-word"
            whiteSpace="normal"
            isDisabled={!isValid}>
            {t('submitTestQuestions')}
          </Button>
        </Flex>
      </Box>
    </form>
  );
};

export default CreateTestQuestions;

'use client';
import React, { FC, useEffect } from 'react';
import { Box, Button, Flex, Heading, Stack, Text, useToast } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { LanguageTypeEnum } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { ExamService } from '@/api/services/exam.service';
import { FormInput } from '@/components/atoms';
import TableCheckbox from '@/components/organisms/TableCheckbox';
import { ExamTranslation } from '@/utils/models/exam';
import { TestQuestionListModel } from '@/utils/models/test-question.model';
import { ExamValidation, OptionalExamValidation } from '@/utils/validation/exam';

const resolver = classValidatorResolver(ExamValidation);

type CreateEditExamProps = {
  examTranslation?: ExamTranslation;
  subjectId: string;
  examId: string;
  testQuestionQueryData: TestQuestionListModel;
  language: LanguageTypeEnum;
};

const CreateEditExam: FC<CreateEditExamProps> = ({
  examId,
  testQuestionQueryData,
  examTranslation,
  language,
}) => {
  const t = useTranslations();
  const toast = useToast();

  const { control, handleSubmit, reset, watch } = useForm<ExamValidation>({
    resolver,
    defaultValues: {
      title: examTranslation?.title || '',
      description: examTranslation?.description || '',
      testQuestionIds: (examTranslation?.testQuestions || []).map(({ id }) => id) || [],
    },
  });

  const testQuestionCount = watch('testQuestionIds').length;

  useEffect(() => {
    if (examTranslation) {
      console.log({ examTranslation });
      reset({
        title: examTranslation.title,
        description: examTranslation.description || '',
        testQuestionIds: examTranslation.testQuestions.map(({ id }) => id) || [],
      });
    } else {
      reset({
        title: '',
        description: '',
        testQuestionIds: [],
      });
    }
  }, [examTranslation, language, reset]);

  const { mutate } = useMutation({
    mutationFn: (data: ExamValidation) => ExamService.createExamTranslation(examId, language, data),
  });

  const { mutate: update } = useMutation({
    mutationFn: (data: OptionalExamValidation) =>
      ExamService.updateExamTranslation(examId, language, data),
  });

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

  const onSubmit = (data: ExamValidation) => {
    mutate(data, { onSuccess: () => toast({ title: 'Success', status: 'success' }) });
  };

  const submitExamUpdate = (data: OptionalExamValidation) => {
    update(data, { onSuccess: () => toast({ title: 'Success', status: 'success' }) });
  };

  return (
    <form onSubmit={handleSubmit(examTranslation ? submitExamUpdate : onSubmit)}>
      <Heading textAlign="center" mb="10px">
        {t('exam')}
      </Heading>
      <Stack
        direction={{ base: 'column', md: 'column' }}
        gap={{ base: '16px', sm: '8px' }}
        borderWidth="1px"
        borderRadius="lg"
        height="700px"
        px="24px"
        py="32px">
        <Flex gap="30px" flexDirection={{ base: 'column', sm: 'row' }}>
          <Flex width={{ base: '100%', sm: '50%' }}>
            <Controller
              name="title"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <FormInput
                  isRequired
                  placeholder="title"
                  name={name}
                  type="text"
                  formLabelName={t('title')}
                  value={value}
                  handleInputChange={onChange}
                />
              )}
            />
          </Flex>

          <Flex width={{ base: '100%', sm: '50%' }}>
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <FormInput
                  name={name}
                  type="text"
                  placeholder="description"
                  formLabelName={t('description')}
                  value={value}
                  handleInputChange={onChange}
                />
              )}
            />
          </Flex>
        </Flex>
        <Flex height={600} overflowY="auto">
          <Controller
            name="testQuestionIds"
            control={control}
            render={({ field: { onChange, value } }) => {
              console.log({ value });
              return (
                <TableCheckbox
                  title="selectTests"
                  data={testQuestionQueryData || []}
                  selectedValues={value}
                  onChange={onChange}
                  // @ts-ignore
                  columns={testQuestionColumns || []}
                />
              );
            }}
          />
        </Flex>
      </Stack>

      <Box my="50px">
        <Text>
          Selected {testQuestionCount} question{testQuestionCount > 1 && 's'}
        </Text>
        <Button colorScheme="teal" type="submit" width="50%" isDisabled={!testQuestionCount}>
          {t('createExam')}
        </Button>
      </Box>
    </form>
  );
};

export default CreateEditExam;

'use client';
import React, { FC } from 'react';
import { Box, Button, Flex, Heading, Stack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { ExamTranslation, LanguageTypeEnum } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { ExamService } from '@/api/services/exam.service';
import { TestQuestionService } from '@/api/services/test-question.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import TableCheckbox from '@/components/organisms/TableCheckbox';
import { TestQuestionListModel } from '@/utils/models/test-question.model';
import { ExamValidation } from '@/utils/validation/exam';

const resolver = classValidatorResolver(ExamValidation);

const languageTypes = [
  {
    id: LanguageTypeEnum.AM,
    type: 'Armenian',
  },
  {
    id: LanguageTypeEnum.RU,
    type: 'Russian',
  },
  {
    id: LanguageTypeEnum.EN,
    type: 'English',
  },
];

type CreateEditExamProps = {
  examTranslation?: ExamTranslation;
  subjectId: string;
  examId: string;
};

const CreateEditExam: FC<CreateEditExamProps> = ({ subjectId, examId }) => {
  const t = useTranslations();

  const { control, handleSubmit } = useForm<ExamValidation>({
    resolver,
    defaultValues: {
      title: '',
      description: '',
      testQuestionIds: [],
      language: LanguageTypeEnum.AM,
    },
  });

  const { data: testQuestionQueryData } = useQuery<TestQuestionListModel>({
    queryKey: ['testQuestion', subjectId],
    queryFn: () => TestQuestionService.getTestQuestionsBySubjectId(subjectId),
    enabled: !!subjectId,
  });

  const { mutate } = useMutation({
    mutationFn: (data: ExamValidation) => ExamService.createExamTranslation(data, examId),
  });

  const testQuestionCcolumnHelper = createColumnHelper<TestQuestionListModel>();

  const testQuestionColumns = [
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
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading textAlign="center">Exam</Heading>
      <Stack
        direction={{ base: 'column', md: 'column' }}
        gap={{ base: '16px', sm: '8px' }}
        borderWidth="1px"
        borderRadius="lg"
        height="1000px"
        px="24px"
        py="32px">
        <Flex gap="30px">
          <Flex width="33.3%">
            <Controller
              name="title"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <FormInput
                  isRequired
                  placeholder={t('title')}
                  name={name}
                  type="text"
                  formLabelName={t('title')}
                  value={value}
                  handleInputChange={onChange}
                />
              )}
            />
          </Flex>

          <Flex width="33.3%">
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <FormInput
                  name={name}
                  type="text"
                  placeholder={t('description')}
                  formLabelName={t('description')}
                  value={value}
                  handleInputChange={onChange}
                />
              )}
            />
          </Flex>

          <Flex width="33.3%">
            <Controller
              name="language"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <SelectLabel
                  isRequired
                  name={name}
                  options={languageTypes}
                  labelName={t('selectExamLanguage')}
                  valueLabel="id"
                  nameLabel="type"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Flex>
        </Flex>
        <Flex height={600} overflowY="auto">
          <Controller
            name="testQuestionIds"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TableCheckbox
                title="selectTests"
                data={testQuestionQueryData || []}
                selectedValues={value}
                onChange={onChange}
                // @ts-ignore
                columns={testQuestionColumns || []}
              />
            )}
          />
        </Flex>
      </Stack>

      <Box my="50px">
        <Button colorScheme="teal" type="submit" width="50%">
          {t('submitExam')}
        </Button>
      </Box>
    </form>
  );
};

export default CreateEditExam;

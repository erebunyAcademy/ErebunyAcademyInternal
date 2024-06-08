'use client';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ExamService } from '@/api/services/exam.service';
import { Locale } from '@/i18n';
import { ROUTE_EXAMINATION } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
import { StudentAnswerMutationModel } from '@/utils/models/test-question.model';

const usePushToQuestion = (lang: Locale, examId: string, examTranslationId: string) => {
  const router = useRouter();

  const path = useMemo(
    () => `${languagePathHelper(lang, ROUTE_EXAMINATION)}/${examId}/${examTranslationId}`,
    [examId, examTranslationId, lang],
  );

  return useCallback((id: string) => router.push(`${path}/${id}`), [path, router]);
};

type FormData = {
  checkboxOptions: Array<string | never>;
  radioOption: string;
};

interface Props {
  params: { examId: string; examTranslationId: string; lang: Locale; testQuestionId: string };
}

const ExamTranslation: FC<Props> = ({
  params: { examTranslationId, examId, lang, testQuestionId },
}) => {
  const navigate = usePushToQuestion(lang, examId, examTranslationId);
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { checkboxOptions: [], radioOption: '' },
  });

  const { data, isSuccess } = useQuery({
    queryKey: ['question', testQuestionId],
    queryFn: ExamService.getExamTestQuestion.bind(null, testQuestionId),
  });

  const { testQuestion, answers, previousQuestionId, nextQuestionId } = data || {};

  const { mutate } = useMutation<StudentAnswerMutationModel, { message: string }, string[]>({
    mutationFn: data => ExamService.createStudentAnswer(examId, testQuestionId, data),
    onSuccess(data) {
      if (nextQuestionId && !!data.length) navigate(nextQuestionId);
    },
  });

  const onPrev = useCallback(() => {
    if (previousQuestionId) navigate(previousQuestionId);
  }, [navigate, previousQuestionId]);

  const onNext: SubmitHandler<FormData> = useCallback(
    values => {
      if (!examId || !testQuestionId) {
        return;
      }
      switch (testQuestion?.type) {
        case 'CHECKBOX':
          mutate(values.checkboxOptions);
          break;
        case 'RADIO':
          mutate([values.radioOption]);
          break;
      }
    },
    [examId, mutate, testQuestion?.type, testQuestionId],
  );

  const renderFormDataByType = useCallback(() => {
    switch (testQuestion?.type) {
      case 'CHECKBOX':
        return (
          <Controller
            name="checkboxOptions"
            control={control}
            render={({ field }) => (
              <CheckboxGroup {...field}>
                <Stack spacing={5} direction="column">
                  {testQuestion?.options.map(item => (
                    <Checkbox key={item.id} value={item.id}>
                      {item.title}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            )}
          />
        );
      case 'RADIO':
        return (
          <Controller
            name="radioOption"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} mt={4}>
                <Stack spacing={5} direction="column">
                  {testQuestion?.options.map(item => (
                    <Radio key={item.id} value={item.id}>
                      {item.title}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            )}
          />
        );
    }
  }, [control, testQuestion?.options, testQuestion?.type]);

  useEffect(() => {
    if (isSuccess && !!answers?.length) {
      switch (testQuestion?.type) {
        case 'CHECKBOX':
          reset({
            checkboxOptions: answers.flatMap(({ optionId }) => (optionId ? [optionId] : [])),
          });
          break;
        case 'RADIO':
          reset({ radioOption: answers[0].optionId || '' });
          break;
      }
    }
  }, [answers, isSuccess, reset, testQuestion?.type]);

  if (!data || !isSuccess) {
    return null;
  }

  return (
    <Box p={5} shadow="md" borderWidth="1px" h="100vh">
      <Center flexDir="column" h="100%">
        <Heading fontSize="xl" mb={10}>
          {testQuestion?.title}
        </Heading>
        {testQuestion?.description && <Text mt={2}>{testQuestion.description}</Text>}
        {renderFormDataByType()}
        <Stack direction="row" spacing={300} mt={20}>
          <Button colorScheme="teal" isDisabled={!previousQuestionId} onClick={onPrev}>
            Previous
          </Button>
          <Button colorScheme="teal" isDisabled={!nextQuestionId} onClick={handleSubmit(onNext)}>
            Next
          </Button>
        </Stack>
      </Center>
    </Box>
  );
};

export default ExamTranslation;

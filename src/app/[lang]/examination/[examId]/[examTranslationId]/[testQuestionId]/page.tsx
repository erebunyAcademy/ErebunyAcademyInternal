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
  useDisclosure,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ExamService } from '@/api/services/exam.service';
import ExamResultsModal from '@/components/molecules/ExamResultsModal';
import ExamTimer from '@/components/molecules/ExamTimer';
import { Locale } from '@/i18n';
import { ROUTE_EXAMINATION, ROUTE_EXAMS } from '@/utils/constants/routes';
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

const TestQuestions: FC<Props> = ({
  params: { examTranslationId, examId, lang, testQuestionId },
}) => {
  const router = useRouter();
  const handleClose = useCallback(() => router.push(ROUTE_EXAMS), [router]);
  const { isOpen, onClose, onOpen } = useDisclosure({ onClose: handleClose });
  const navigate = usePushToQuestion(lang, examId, examTranslationId);
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { checkboxOptions: [], radioOption: '' },
  });

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['question', testQuestionId],
    queryFn: ExamService.getExamTestQuestion.bind(null, testQuestionId),
    enabled: !!testQuestionId,
  });

  console.log(data?.startTime, data?.duration);

  const { testQuestion, answers, previousQuestionId, nextQuestionId } = data || {};

  const { mutate: finish } = useMutation<boolean, { message: string }, string>({
    mutationFn: ExamService.finishExam,
  });

  const onFinish = useCallback(() => {
    const isReady = confirm('Are you sure you want to finish this examination?');
    if (isReady) {
      finish(examId, {
        onSuccess(hasFinished) {
          if (hasFinished) {
            onOpen();
          }
        },
      });
    }
  }, [examId, finish, onOpen]);

  const { mutate } = useMutation<StudentAnswerMutationModel, { message: string }, string[]>({
    mutationFn: data => ExamService.createStudentAnswer(examId, testQuestionId, data),
    onSuccess(hasCreated) {
      if (nextQuestionId && hasCreated) {
        navigate(nextQuestionId);
      } else if (!nextQuestionId && hasCreated) {
        onFinish();
      }
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

  if (!data || !isSuccess || isLoading) {
    return null;
  }

  return (
    <Box p={5} shadow="md" borderWidth="1px" h="100vh">
      {data && data.duration && data.startTime && (
        <ExamTimer durationInMinutes={data.duration} startTime={data.startTime} />
      )}
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
          <Button colorScheme="teal" onClick={handleSubmit(onNext)}>
            {nextQuestionId ? 'Next' : 'Finish'}
          </Button>
        </Stack>
      </Center>
      <ExamResultsModal isOpen={isOpen} onClose={onClose} examId={examId} onFinish={handleClose} />
    </Box>
  );
};

export default TestQuestions;

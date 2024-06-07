'use client';
import React, { useCallback } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ExamService } from '@/api/services/exam.service';
import { ROUTE_EXAMINATION } from '@/utils/constants/routes';

const ExamTranslation = ({
  params: { examTranslationId, examId },
  searchParams,
}: {
  params: { examId: string; examTranslationId: string };
  searchParams: { questionId: string };
}) => {
  const router = useRouter();

  const { data, isSuccess } = useQuery({
    queryKey: ['question', examTranslationId, searchParams.questionId],
    queryFn: ExamService.getExamTestQuestion.bind(null, examTranslationId, searchParams.questionId),
  });

  const { testQuestion, previousQuestionId, nextQuestionId } = data || {};

  const onPrev = useCallback(
    () =>
      router.push(
        `${ROUTE_EXAMINATION}/${examId}/${examTranslationId}?questionId=${previousQuestionId}`,
      ),
    [examId, examTranslationId, previousQuestionId, router],
  );

  const onNext = useCallback(() => {
    return router.push(
      `${ROUTE_EXAMINATION}/${examId}/${examTranslationId}?questionId=${nextQuestionId}`,
    );
  }, [examId, examTranslationId, nextQuestionId, router]);

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
        {testQuestion?.type === 'RADIO' && (
          <RadioGroup mt={4}>
            <Stack spacing={5} direction="column">
              {testQuestion.options.map(item => (
                <Radio key={item.id} value={item.id}>
                  {item.title}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        )}
        {testQuestion?.type === 'CHECKBOX' && (
          <CheckboxGroup>
            <Stack spacing={5} direction="column">
              {testQuestion?.options.map(item => (
                <Checkbox key={item.id} value={item.id}>
                  {item.title}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        )}
        <Stack direction="row" spacing={300} mt={20}>
          <Button colorScheme="teal" isDisabled={!previousQuestionId} onClick={onPrev}>
            Previous
          </Button>
          <Button colorScheme="teal" onClick={onNext}>
            Next
          </Button>
        </Stack>
      </Center>
    </Box>
  );
};

export default ExamTranslation;
